// backend/src/models/Submission.js
import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  problemId: {
    type: String,
    required: true,
    index: true
  },
  problemTitle: {
    type: String
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'cpp', 'java']
  },
  testResults: [{
    testNumber: Number,
    passed: Boolean,
    input: String,
    expected: String,
    output: String,
    executionTime: Number,
    description: String
  }],
  totalTests: {
    type: Number,
    default: 0
  },
  passedTests: {
    type: Number,
    default: 0
  },
  executionTime: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded', 'Compilation Error'],
    default: 'Accepted'
  },
  points: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Indexes for efficient queries
submissionSchema.index({ userId: 1, timestamp: -1 });
submissionSchema.index({ problemId: 1, status: 1 });
submissionSchema.index({ status: 1, timestamp: -1 });

// Virtual for acceptance rate
submissionSchema.virtual('acceptanceRate').get(function() {
  if (this.totalTests === 0) return 0;
  return Math.round((this.passedTests / this.totalTests) * 100);
});

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;