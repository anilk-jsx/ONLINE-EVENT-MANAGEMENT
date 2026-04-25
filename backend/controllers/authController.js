import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export async function register(req, res) {
  try {
    const { name, email, password, rpassword, mobile_number, role = 'user', location = '' } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    // Validation
    if (!name || !email || !password || !rpassword || !mobile_number) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check password match
    if (password !== rpassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create user
    const newUser = new User({
      name,
      email: normalizedEmail,
      mobile_number,
      password: hashedPassword,
      role,
      location
    });

    await newUser.save();

    // Prepare user response (without password)
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      mobile_number: newUser.mobile_number,
      role: newUser.role,
      location: newUser.location
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Prepare user response (without password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile_number: user.mobile_number,
      role: user.role,
      location: user.location,
      created_at: user.created_at
    };

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
}

export async function getProfile(req, res) {
  try {
    const userId = req.user.id;

    // Find user by ID, exclude password
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: error.message
    });
  }
}

// Admin: Get all users
export async function getAllUsers(req, res) {
  try {
    const users = await User.find().select('-password').sort({ created_at: -1 });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message
    });
  }
}

// User: Update own profile
export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { name, mobile_number, location } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (mobile_number) user.mobile_number = mobile_number;
    if (location !== undefined) user.location = location;
    user.updated_at = new Date();

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
}

// Admin: Update any user
export async function adminUpdateUser(req, res) {
  try {
    const { userId } = req.params;
    const { name, mobile_number, location, role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (mobile_number) user.mobile_number = mobile_number;
    if (location !== undefined) user.location = location;
    if (role && ['user', 'admin'].includes(role)) user.role = role;
    user.updated_at = new Date();

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({ success: false, message: 'Failed to update user', error: error.message });
  }
}

// Admin: Delete a user
export async function adminDeleteUser(req, res) {
  try {
    const { userId } = req.params;
    const { Registration, Event } = await import('../config/database.js');

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete user's registrations
    await Registration.deleteMany({ user_id: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
  }
}
