import { Registration, Event, User } from '../config/database.js';
import mongoose from 'mongoose';

// Register user for an event
export async function registerForEvent(req, res) {
  try {
    const { eventId } = req.params;
    const { number_of_seats = 1 } = req.body;
    const userId = req.user.id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event is private
    if (event.event_type === 'private' && event.organizer_id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'This is a private event. Only the organizer can add participants.'
      });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      user_id: userId,
      event_id: eventId
    });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'Already registered for this event'
      });
    }

    // Check available seats
    const aggregations = await Registration.aggregate([
      { $match: { event_id: new mongoose.Types.ObjectId(eventId), status: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalSeats: { $sum: '$number_of_seats' } } }
    ]);
    const currentlyBooked = aggregations.length > 0 ? aggregations[0].totalSeats : 0;

    if (currentlyBooked + Number(number_of_seats) > event.available_seats) {
      return res.status(400).json({
        success: false,
        message: `Event is full or not enough seats available. Remaining seats: ${event.available_seats - currentlyBooked}`
      });
    }

    // Calculate total amount
    const total_amount = event.price * Number(number_of_seats);

    // Create registration
    const registration = new Registration({
      user_id: userId,
      event_id: eventId,
      status: 'registered',
      number_of_seats: Number(number_of_seats),
      total_amount
    });

    await registration.save();

    // Populate details
    await registration.populate('user_id', 'name email mobile_number');
    await registration.populate('event_id');

    res.status(201).json({
      success: true,
      message: 'Successfully registered for event',
      registration
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register for event',
      error: error.message
    });
  }
}

// Get user's event registrations
export async function getUserRegistrations(req, res) {
  try {
    const userId = req.user.id;

    const registrations = await Registration.find({ user_id: userId })
      .populate('event_id')
      .sort({ created_at: -1 });

    res.json({
      success: true,
      message: 'User registrations retrieved successfully',
      registrations
    });
  } catch (error) {
    console.error('Get user registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve registrations',
      error: error.message
    });
  }
}

// Get event registrations (by organizer or admin)
export async function getEventRegistrations(req, res) {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Check if event exists and user is organizer or admin
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.organizer_id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const registrations = await Registration.find({ event_id: eventId })
      .populate('user_id', 'name email mobile_number')
      .sort({ created_at: -1 });

    const total_booked = registrations
      .filter(r => r.status !== 'cancelled')
      .reduce((sum, r) => sum + r.number_of_seats, 0);

    res.json({
      success: true,
      message: 'Event registrations retrieved successfully',
      total_registrations: registrations.length,
      total_booked_seats: total_booked,
      available_seats: event.available_seats - total_booked,
      registrations
    });
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve registrations',
      error: error.message
    });
  }
}

// Update registration (increase seats only)
export async function updateRegistration(req, res) {
  try {
    const { registrationId } = req.params;
    const { number_of_seats } = req.body;
    const userId = req.user.id;

    if (!number_of_seats || number_of_seats < 1) {
      return res.status(400).json({
        success: false,
        message: 'number_of_seats is required and must be at least 1'
      });
    }

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if user is owner
    if (registration.user_id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a cancelled registration'
      });
    }

    const newSeats = Number(number_of_seats);

    // Only allow increasing seats
    if (newSeats <= registration.number_of_seats) {
      return res.status(400).json({
        success: false,
        message: `You can only increase the number of seats. Current: ${registration.number_of_seats}`
      });
    }

    const additionalSeats = newSeats - registration.number_of_seats;

    // Check if event has enough remaining seats
    const event = await Event.findById(registration.event_id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Associated event not found'
      });
    }

    const aggregations = await Registration.aggregate([
      { $match: { event_id: registration.event_id, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalSeats: { $sum: '$number_of_seats' } } }
    ]);
    const currentlyBooked = aggregations.length > 0 ? aggregations[0].totalSeats : 0;
    const remainingSeats = event.available_seats - currentlyBooked;

    if (additionalSeats > remainingSeats) {
      return res.status(400).json({
        success: false,
        message: `Not enough seats available. Remaining seats: ${remainingSeats}`
      });
    }

    // Calculate the additional amount for the extra seats
    const additionalAmount = event.price * additionalSeats;

    // Update registration
    registration.number_of_seats = newSeats;
    registration.total_amount = event.price * newSeats;
    registration.updated_at = new Date();
    await registration.save();

    await registration.populate('event_id');
    await registration.populate('user_id', 'name email mobile_number');

    res.json({
      success: true,
      message: `Successfully added ${additionalSeats} more seat(s). Additional payment: ₹${additionalAmount}`,
      registration,
      additional_amount: additionalAmount
    });
  } catch (error) {
    console.error('Update registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update registration',
      error: error.message
    });
  }
}

// Cancel registration
export async function cancelRegistration(req, res) {
  try {
    const { registrationId } = req.params;
    const userId = req.user.id;

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if user is owner or admin
    if (registration.user_id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update status to cancelled
    registration.status = 'cancelled';
    registration.updated_at = new Date();
    await registration.save();

    res.json({
      success: true,
      message: 'Registration cancelled successfully',
      registration
    });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel registration',
      error: error.message
    });
  }
}

// Get event statistics (for admins/organizers)
export async function getEventStatistics(req, res) {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check access
    if (event.organizer_id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const activeRegs = await Registration.find({ event_id: eventId, status: 'registered' });
    const activeRegistrations = activeRegs.length;
    const totalBookedSeats = activeRegs.reduce((sum, r) => sum + r.number_of_seats, 0);
    
    const cancelledRegistrations = await Registration.countDocuments({
      event_id: eventId,
      status: 'cancelled'
    });

    res.json({
      success: true,
      message: 'Event statistics retrieved successfully',
      statistics: {
        event_id: eventId,
        total_registrations: activeRegistrations + cancelledRegistrations,
        active_registrations: activeRegistrations,
        cancelled_registrations: cancelledRegistrations,
        booked_seats: totalBookedSeats,
        available_seats: event.available_seats - totalBookedSeats,
        total_seats: event.available_seats,
        occupancy_rate: ((totalBookedSeats / event.available_seats) * 100).toFixed(2) + '%'
      }
    });
  } catch (error) {
    console.error('Get event statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics',
      error: error.message
    });
  }
}
