import { Event, Registration, User } from '../config/database.js';

// Create a new event
export async function createEvent(req, res) {
  try {
    const { title, description, category, date, time, location, price, available_seats, duration, event_type } = req.body;
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
      duration,
      event_type: event_type || 'public'
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
    const { title, description, category, date, time, location, price, available_seats, duration, event_type } = req.body;
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

    // If event is approved, only allow price change
    if (event.status === 'approved') {
      if (price !== undefined) event.price = price;
      // Reject any other field changes for approved events
      const restrictedFields = ['title', 'description', 'category', 'date', 'time', 'location', 'available_seats', 'duration', 'event_type'];
      const attemptedChanges = restrictedFields.filter(f => req.body[f] !== undefined);
      if (attemptedChanges.length > 0 && price === undefined) {
        return res.status(400).json({
          success: false,
          message: 'This event is already approved. You can only change the ticket price.'
        });
      }
    } else {
      // Event is pending or rejected — allow all field updates
      if (title) event.title = title;
      if (description !== undefined) event.description = description;
      if (category) event.category = category;
      if (date) event.date = date;
      if (time) event.time = time;
      if (location) event.location = location;
      if (price !== undefined) event.price = price;
      if (available_seats) event.available_seats = available_seats;
      if (duration) event.duration = duration;
      if (event_type) event.event_type = event_type;
    }

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

// Get events created by the logged in user
export async function getMyEvents(req, res) {
  try {
    const userId = req.user.id;

    const events = await Event.find({ organizer_id: userId })
      .populate('organizer_id', 'name email mobile_number')
      .sort({ created_at: -1 });

    res.json({
      success: true,
      message: 'My events retrieved successfully',
      events
    });
  } catch (error) {
    console.error('Get my events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve my events',
      error: error.message
    });
  }
}

// Get upcoming public events
export async function getUpcomingEvents(req, res) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Find upcoming approved public events
    const events = await Event.find({
      status: 'approved',
      event_type: 'public',
      date: { $gte: today }
    })
    .populate('organizer_id', 'name email')
    .sort({ date: 1, time: 1 });

    // Filter out events that are full and calculate remaining seats
    const eventsWithSeats = await Promise.all(events.map(async (event) => {
      const aggregations = await Registration.aggregate([
        { $match: { event_id: event._id, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, totalSeats: { $sum: '$number_of_seats' } } }
      ]);
      const bookedSeats = aggregations.length > 0 ? aggregations[0].totalSeats : 0;
      const availableSeats = event.available_seats - bookedSeats;
      return {
        ...event.toObject(),
        available_seats_remaining: availableSeats
      };
    }));

    // Filter events that have seats available
    const availableEvents = eventsWithSeats.filter(e => e.available_seats_remaining > 0);

    res.json({
      success: true,
      message: 'Upcoming events retrieved successfully',
      events: availableEvents
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve upcoming events',
      error: error.message
    });
  }
}
