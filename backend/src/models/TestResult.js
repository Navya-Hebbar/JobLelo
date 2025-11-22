// backend/src/models/TestResult.js
import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    default: 5
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  timeTakenSeconds: {
    type: Number,
    required: true
  },
  completedInTime: {
    type: Boolean,
    default: true
  },
  speedRating: {
    type: String,
    enum: ['Super Fast', 'Fast', 'Normal', 'Deliberate', 'Slow'],
    default: 'Normal'
  },
  passed: {
    type: Boolean,
    default: false
  },
  isSuspicious: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('TestResult', testResultSchema);