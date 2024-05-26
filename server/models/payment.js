import mongoose from "mongoose";
import { CATEGORIES } from './constants.js';

const PaymentSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: [true, 'Wartość jest wymagana']
  },
  description: {
    type: String
  },
  category: {
    type: String,
    enum: {
      values: Object.keys(CATEGORIES),
      message: 'Nieprawidłowa kategoria'
    }
  },
  date: {
    type: Date,
    default: Date.now()
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;