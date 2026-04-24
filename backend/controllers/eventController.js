import { Event, Registration, User } from '../config/database.js';

// Create a new event
export async function createEvent(req, res) {
  try {
    const { title, description, category, date, time, location, price, available_seats, duration } = req.body;
    const organizer_id = req.user.id;

    // Validation
    if (!title || !date || !time || !location || !available_seats || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing: title, date, time, location, available_seats, duration'
      });
    }

    // Create event
    const newEvent = new Event({
      title,
      description,
      category: category || 'Other',
      date,
      time,
      location,
      organizer_id,
      price: price || 0,
      available_seats,
      duration
    });

    await newEvent.save();

    // Populate organizer details
    await newEvent.populate('organizer_id', 'name email mobile_number');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
}

// Get all events with filtering
export async function getEvents(req, res) {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(filter)
      .populate('organizer_id', 'name email mobile_number')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ created_at: -1 });

    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      message: 'Events retrieved successfully',
      events,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_events: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve events',
      error: error.message
    });
  }
}

// Get event by ID
export async function getEventById(req, res) {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId)
      .populate('organizer_id', 'name email mobile_number');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get registration count
    const registrationCount = await Registration.countDocuments({ event_id: eventId });

    res.json({
      success: true,
      message: 'Event retrieved successfully',
      event: {
        ...event.toObject(),
        registered_count: registrationCount,
        available_seats_remaining: event.available_seats - registrationCount
      }
    });
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve event',
      error: error.message
    });
  }
}

// Update event (only by organizer)
export async function updateEvent(req, res) {
  try {
    const { eventId } = req.params;
    const { title, description, category, date, time, location, price, available_seats, duration } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is organizer
    if (event.organizer_id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only event organizer can update this event'
      });
    }

    // Update fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (category) event.category = category;
    if (date) event.date = date;
    if (time) event.time = time;
    if (location) event.location = location;
    if (price !== undefined) event.price = price;
    if (available_seats) event.available_seats = available_seats;
    if (duration) event.duration = duration;

    event.updated_at = new Date();
    await event.save();

    await event.populate('organizer_id', 'name email mobile_number');

    res.json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
}

// Delete event (only by organizer)
export async function deleteEvent(req, res) {
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

    // Check if user is organizer
    if (event.organizer_id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only event organizer can delete this event'
      });
    }

    await Event.findByIdAndDelete(eventId);

    // Also delete associated registrations
    await Registration.deleteMany({ event_id: eventId });

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
}

// Get events by organizer
export async function getEventsByOrganizer(req, res) {
  try {
    const { organizerId } = req.params;

    const events = await Event.find({ organizer_id: organizerId })
      .populate('organizer_id', 'name email mobile_number')
      .sort({ created_at: -1 });

    res.json({
      success: true,
      message: 'Events retrieved successfully',
      events
    });
  } catch (error) {
    console.error('Get events by organizer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve events',
      error: error.message
    });
  }
}
