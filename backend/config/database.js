import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = (process.env.MONGODB_URI || 'mongodb://localhost:27017/event_management').trim();

export async function initializeDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    const { host, name } = mongoose.connection;
    console.log(`MongoDB connected successfully (host: ${host}, database: ${name})`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  mobile_number: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Event Schema
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['Technology', 'Marketing', 'Education', 'Business', 'Programming', 'Other'],
    default: 'Other'
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  organizer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  available_seats: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  event_type: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Registration Schema
const registrationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  status: {
    type: String,
    enum: ['registered', 'completed', 'cancelled'],
    default: 'registered'
  },
  number_of_seats: {
    type: Number,
    default: 1
  },
  total_amount: {
    type: Number,
    default: 0
  },
  qr_token: {
    type: String,
    unique: true,
    sparse: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better query performance
userSchema.index({ email: 1 });
eventSchema.index({ organizer_id: 1 });
registrationSchema.index({ user_id: 1, event_id: 1 }, { unique: true });

// Create models
export const User = mongoose.model('User', userSchema);
export const Event = mongoose.model('Event', eventSchema);
export const Registration = mongoose.model('Registration', registrationSchema);

export default {
  User,
  Event,
  Registration
};
