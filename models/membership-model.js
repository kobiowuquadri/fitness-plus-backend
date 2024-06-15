const mongoose = require('mongoose');
const { Schema } = mongoose;

const membershipSchema = new Schema({
  membershipId: {
    type: String,
    unique: true,
    required: [true, 'Membership ID is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
  membershipType: {
    type: String,
    required: [true, 'Membership type is required'],
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  dueDate: {
    type: Date,
  },
  monthlyDueDate: {
    type: Date,
  },
  totalAmount: {
    type: Number,
  },
  monthlyAmount: {
    type: Number,
  },
  isFirstMonth: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true, // Add createdAt and updatedAt fields
});

module.exports = mongoose.model('Membership', membershipSchema);