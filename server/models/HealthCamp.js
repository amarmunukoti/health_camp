const mongoose = require('mongoose');

const healthCampSchema = new mongoose.Schema(
  {
    campNameEnglish: {
      type: String,
      required: true,
      trim: true,
    },
    campNameTelugu: {
      type: String,
      default: '',
      trim: true,
    },
    organizerName: {
      type: String,
      required: true,
      trim: true,
    },
    campType: {
      type: String,
      required: true,
      enum: [
        'General Health Check-up',
        'Eye Check-up',
        'Dental Camp',
        'Blood Donation Camp',
        'Diabetes Screening',
        'Vaccination Camp',
        'Women\'s Health Camp',
        'Children\'s Health Camp',
        'Other',
      ],
    },
    date: {
      type: String, // Format: YYYY-MM-DD for easy filtering & rendering
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    descriptionEnglish: {
      type: String,
      required: true,
    },
    descriptionTelugu: {
      type: String,
      default: '',
    },
    servicesEnglish: {
      type: String,
      required: true,
    },
    servicesTelugu: {
      type: String,
      default: '',
    },
    contactNumber: {
      type: String,
      required: true,
    },
    maxParticipants: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('HealthCamp', healthCampSchema);
