import User from '../models/user.js';
import Group from '../models/group.js';
import Goal from '../models/goal.js';
import Payment from '../models/payment.js';
import Notification from '../models/notification.js';

export const transformUser = async (userId) => {
  const user = await User.findById(userId).select('name surname email');
  return {
    ...user._doc
  };
}

export const transformPayment = async (paymentId) => {
  const payment = await Payment.findById(paymentId);
  return {
    ...payment._doc,
    user: await transformUser(payment.user)
  }
}

export const transformGoal = async (goalId) => {
  const goal = await Goal.findById(goalId);
  return {
    ...goal._doc,
    user: await transformUser(goal.user)
  }
}

export const transformNotification = async (notificationId) => {
  const notification = await Notification.findById(notificationId).select('value createdAt');
  return {
    ...notification._doc
  };
}

export const transformData = async (dataIds, transformFunction) => {
  const data = [];
  for(const dataId of dataIds){ data.push(await transformFunction(dataId)); }
  return data;
}

export const transformGroup = async (group) => {
  return {
    ...group._doc,
    admins: await transformData(group.admins, transformUser),
    users: await transformData(group.users, transformUser),
    income: await transformData(group.income, transformPayment),
    expenses: await transformData(group.expenses, transformPayment),
    goals: await transformData(group.goals, transformGoal),
    payments: await transformData(group.payments, transformGoal),
    notifications: await transformData(group.notifications, transformNotification)
  }
}

export const transformGroups = async (groups) => {
  const data = [];
  for(const group of groups){ data.push(await transformGroup(group)); }
  return data;
}

export const deleteGroupComponents = async (groupId) => {
  const group = await Group.findById(groupId);

  for(const itemId of [...group.income, ...group.expenses]){ await Payment.findByIdAndDelete(itemId); }
  for(const itemId of [...group.goals, ...group.payments]){ await Goal.findByIdAndDelete(itemId); }
  for(const itemId of group.notifications){ await Notification.findByIdAndDelete(itemId); }

  for(const userId of [...group.admins, group.users]){
    const user = await User.findById(userId);
    if(user){
      user.groups = [...user.groups].filter(itemId => `${itemId}` !== `${groupId}`);
      await user.save();
    }
  }

  await Group.findByIdAndDelete(groupId);
}