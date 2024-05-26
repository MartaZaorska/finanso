import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: [true, 'Wartość jest wymagana']
  },
  name: {
    type: String,
    required: [true, 'Nazwa jest wymagana']
  },
  description: {
    type: String
  },
  targetDate: {
    type: Date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Goal = mongoose.model('Goal', GoalSchema);

export default Goal;