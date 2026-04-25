import express from 'express';
import { param, validationResult } from 'express-validator';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import {
  registerForEvent,
  getUserRegistrations,
  getEventRegistrations,
  updateRegistration,
  cancelRegistration,
  getEventStatistics,
  adminGetAllRegistrations,
  adminCancelRegistration
} from '../controllers/registrationController.js';

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

// ===================== ADMIN ROUTES =====================

// Admin: Get all registrations grouped by event
router.get('/admin/all', adminMiddleware, adminGetAllRegistrations);

// Admin: Cancel any registration
router.delete(
  '/admin/:registrationId/cancel',
  adminMiddleware,
  param('registrationId').isMongoId().withMessage('Invalid registration ID'),
  handleValidationErrors,
  adminCancelRegistration
);

// ===================== USER ROUTES =====================

// Register for event (protected)
router.post(
  '/event/:eventId/register',
  authMiddleware,
  param('eventId').isMongoId().withMessage('Invalid event ID'),
  handleValidationErrors,
  registerForEvent
);

// Get user's registrations (protected)
router.get(
  '/my-registrations',
  authMiddleware,
  getUserRegistrations
);

// Get event registrations (protected, organizer/admin only)
router.get(
  '/event/:eventId/registrations',
  authMiddleware,
  param('eventId').isMongoId().withMessage('Invalid event ID'),
  handleValidationErrors,
  getEventRegistrations
);

// Get event statistics (protected, organizer/admin only)
router.get(
  '/event/:eventId/statistics',
  authMiddleware,
  param('eventId').isMongoId().withMessage('Invalid event ID'),
  handleValidationErrors,
  getEventStatistics
);

// Update registration - increase seats (protected)
router.put(
  '/:registrationId',
  authMiddleware,
  param('registrationId').isMongoId().withMessage('Invalid registration ID'),
  handleValidationErrors,
  updateRegistration
);

// Cancel registration (protected)
router.delete(
  '/:registrationId/cancel',
  authMiddleware,
  param('registrationId').isMongoId().withMessage('Invalid registration ID'),
  handleValidationErrors,
  cancelRegistration
);

export default router;
