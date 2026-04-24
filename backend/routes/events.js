import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByOrganizer
} from '../controllers/eventController.js';

const router = express.Router();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({ field: err.param, message: err.msg }))
    });
  }
  next();
};

// Event creation validation
const validateCreateEvent = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('description')
    .optional()
    .trim(),
  body('category')
    .optional()
    .isIn(['Technology', 'Marketing', 'Education', 'Business', 'Programming', 'Other'])
    .withMessage('Invalid category'),
  body('date')
    .notEmpty().withMessage('Date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date format should be YYYY-MM-DD'),
  body('time')
    .notEmpty().withMessage('Time is required')
    .matches(/^\d{2}:\d{2}$/).withMessage('Time format should be HH:MM'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required'),
  body('available_seats')
    .isInt({ min: 1 }).withMessage('Available seats must be at least 1'),
  body('duration')
    .notEmpty().withMessage('Duration is required'),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number')
];

// Routes

// Create event (protected)
router.post(
  '/',
  authMiddleware,
  validateCreateEvent,
  handleValidationErrors,
  createEvent
);

// Get all events (public)
router.get('/', getEvents);

// Get event by ID (public)
router.get(
  '/:eventId',
  param('eventId').isMongoId().withMessage('Invalid event ID'),
  handleValidationErrors,
  getEventById
);

// Update event (protected, only organizer)
router.put(
  '/:eventId',
  authMiddleware,
  param('eventId').isMongoId().withMessage('Invalid event ID'),
  handleValidationErrors,
  updateEvent
);

// Delete event (protected, only organizer)
router.delete(
  '/:eventId',
  authMiddleware,
  param('eventId').isMongoId().withMessage('Invalid event ID'),
  handleValidationErrors,
  deleteEvent
);

// Get events by organizer (public)
router.get(
  '/organizer/:organizerId',
  param('organizerId').isMongoId().withMessage('Invalid organizer ID'),
  handleValidationErrors,
  getEventsByOrganizer
);

export default router;
