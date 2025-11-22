// backend/src/models/Resume.js
import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    website: String
  },
  summary: String,
  education: [{
    school: String,
    degree: String,
    startDate: String,
    endDate: String,
    description: String
  }],
  experience: [{
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    description: String
  }],
  skills: [String],
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    link: String
  }],
  version: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

resumeSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.model('Resume', resumeSchema);