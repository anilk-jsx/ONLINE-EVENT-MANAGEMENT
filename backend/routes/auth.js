import express from 'express';
import { body, validationResult } from 'express-validator';
import { register, login, getProfile, getAllUsers } from '../controllers/authController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .matches(/^[a-zA-Z\s]{2,50}$/).withMessage('Name should contain only letters and spaces (2-50 characters)'),
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email address'),
  body('mobile_number')
    .matches(/^[6-9]\d{9}$/).withMessage('Invalid mobile number'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/).withMessage('Password must contain uppercase, lowercase, number, and special character'),
  body('rpassword')
    .custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')
];

const validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email address'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

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

// Routes
router.post('/register', validateRegistration, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);

// Protected routes
router.get('/profile', authMiddleware, getProfile);

// Admin routes
router.get('/admin/users', adminMiddleware, getAllUsers);

export default router;
