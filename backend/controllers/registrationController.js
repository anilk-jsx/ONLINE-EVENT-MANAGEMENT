import { Registration, Event, User } from '../config/database.js';

// Register user for an event
export async function registerForEvent(req, res) {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
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
    const registrationCount = await Registration.countDocuments({ event_id: eventId });
    if (registrationCount >= event.available_seats) {
      return res.status(400).json({
        success: false,
        message: 'Event is full, no available seats'
      });
    }

    // Create registration
    const registration = new Registration({
      user_id: userId,
      event_id: eventId,
      status: 'registered'
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

    res.json({
      success: true,
      message: 'Event registrations retrieved successfully',
      total_registrations: registrations.length,
      available_seats: event.available_seats - registrations.length,
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

    const totalRegistrations = await Registration.countDocuments({ event_id: eventId });
    const activeRegistrations = await Registration.countDocuments({
      event_id: eventId,
      status: 'registered'
    });
    const cancelledRegistrations = await Registration.countDocuments({
      event_id: eventId,
      status: 'cancelled'
    });

    res.json({
      success: true,
      message: 'Event statistics retrieved successfully',
      statistics: {
        event_id: eventId,
        total_registrations: totalRegistrations,
        active_registrations: activeRegistrations,
        cancelled_registrations: cancelledRegistrations,
        available_seats: event.available_seats - activeRegistrations,
        total_seats: event.available_seats,
        occupancy_rate: ((totalRegistrations / event.available_seats) * 100).toFixed(2) + '%'
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
