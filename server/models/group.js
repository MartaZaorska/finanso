import mongoose from 'mongoose';
import Notification from './notification.js';
import { CURRENCIES } from './constants.js';

const GroupSchema = new mongoose.Schema({
  name: {
    type: String
  },
  currency: {
    type: String,
    enum: {
      values: CURRENCIES,
      message: 'Nieprawidłowa waluta'
    }
  },
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  income: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }],
  expenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }],
  goals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal'
  }],
  payments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal'
  }],
  notifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification'
  }]
}, {
  timestamps: true
});

GroupSchema.methods.checkUser = function(userId){
  return [...this.admins, ...this.users].findIndex(id => `${id}` === `${userId}`) >= 0;
}

GroupSchema.methods.checkAdmin = function(userId){
  return this.admins.findIndex(id => `${id}` === `${userId}`) >= 0;
}

GroupSchema.methods.addNotification = async function(value){
  const notification = await Notification.create({ value });
  this.notifications = [notification._id, ...this.notifications];
  await this.save();
}

const Group = mongoose.model("Group", GroupSchema);

export default Group;