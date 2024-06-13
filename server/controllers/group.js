import asyncHandler from 'express-async-handler';

import Group from '../models/group.js';
import Payment from '../models/payment.js';
import Goal from '../models/goal.js';

import { 
  transformGroup, 
  transformUser,
  transformUsers,
  transformNotifications,
  deleteGroupComponents
} from './transform.js';
import User from '../models/user.js';

import { CATEGORIES } from '../models/constants.js'

const checkGroup = async (res, groupId, userId) => {
  const group = await Group.findById(groupId);

  if(!group){
    res.status(404);
    throw new Error("Nie znalezniono grupy o podanym id");
  }

  if(!group.checkUser(userId)){
    res.status(403);
    throw new Error("Użytkownik nie należy do grupy");
  }

  return group;
}

const checkGroupItem = async (res, id, type) => {
  const groupItem = await (type === "income" || type === "expenses" ? Payment.findById(id) : Goal.findById(id)).populate("user");

  if(!groupItem){
    res.status(404);
    throw new Error(`Nie znaleziono elementu o podanym id`);
  }

  return groupItem;
}

const findUser = async (res, userId) => {
  const user = await User.findById(userId);

  if(!user){
    res.status(404);
    throw new Error(`Użytkownik o id: ${userId} nie isnieje`);
  }

  return user;
}

const createPayment = async (res, data) => {
  const payment = await Payment.create(data);

  if(!payment){
    res.status(400);
    throw new Error("Nieprawidłowe dane");
  }

  return payment;
}

const createGoal = async (res, data) => {
  const goal = await Goal.create(data);

  if(!goal){
    res.status(400);
    throw new Error("Nieprawidłowe dane");
  }

  return goal;
}

const getTypeName = type => {
  return type === "income" ? "przychód" : (type === "expenses" ? "wydatek" : (type === "goals" ? "cel finansowy" : "przyszłą płatność"));
}

export const getGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const group = await checkGroup(res, id, req.user._id);

  res.status(200).json({ ...await transformGroup(group) });
});


export const createGroup = asyncHandler(async (req, res) => {
  const user = await findUser(res, req.user._id);

  const { name, currency } = req.body;
  const group = await Group.create({ name, currency, admins: [user._id] });

  if(!group){
    res.status(400);
    throw new Error("Wystąpił problem z utworzeniem obiektu Group");
  }

  user.groups = [...user.groups, group._id];
  await user.save();

  res.status(200).json({ ...await transformGroup(group) }); 
});

export const updateGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const group = await checkGroup(res, id, req.user._id);
  
  if(!group.checkAdmin(req.user._id)){
    res.status(403);
    throw new Error("Użytkownik nie posiada uprawnień do edycji grupy");
  }

  const { name, currency } = req.body;

  const oldName = group.name;
  const oldCurrency = group.currency;

  group.name = name || oldName;
  group.currency = currency || oldCurrency;

  await group.save();
  await group.addNotification(`Użytkownik ${req.user.name} ${req.user.surname} zmodyfikował grupę "${oldName}". ${name === oldName ? '' : `Zmienił nazwę grupy na "${name}".`}${currency === oldCurrency ? '' : ` Zmienił główną walutę grupy na ${currency}.`}`);

  res.status(200).json({ 
    _id: group._id,
    name: group.name,
    currency: group.currency
  });
});

export const deleteGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const group = await checkGroup(res, id, req.user._id);
  
  if(!group.checkAdmin(req.user._id)){
    res.status(403);
    throw new Error("Użytkownik nie posiada uprawnień do usunięcia grupy");
  }
  
  await deleteGroupComponents(group._id);
  res.status(200).json({ message: `Grupa o id: ${id} została usunięta`});
});

export const getNotifications = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const group = await checkGroup(res, id, req.user._id);

  res.status(200).json({
    notifications: await transformNotifications(group.notifications)
  });
});

export const createTransaction = type => asyncHandler(async (req, res) => {
  const { id } = req.params;

  const group = await checkGroup(res, id, req.user._id);

  const { value, description = "", category, date } = req.body;
  const transaction = await createPayment(res, { value, description, date, category, user: req.user._id });
  
  group[type] = [...group[type], transaction];

  await group.save();
  await group.addNotification(`Użytkownik ${req.user.name} ${req.user.surname} dodał nowy ${type === "income" ? "przychód" : "wydatek"} w kategorii "${CATEGORIES[transaction.category]}" o wartości ${transaction.value} ${group.currency}.`);

  res.status(200).json({
    ...transaction._doc,
    user: await transformUser(transaction.user)
  }); 
});

export const createGroupItem = type => asyncHandler(async (req, res) => {
  const { id } = req.params;

  const group = await checkGroup(res, id, req.user._id);

  const { value, name, description = "", targetDate } = req.body;
  const groupItem = await createGoal(res, { value, name, description, targetDate, user: req.user._id });
  
  group[type] = [...group[type], groupItem];

  await group.save();
  await group.addNotification(`Użytkownik ${req.user.name} ${req.user.surname} dodał ${type === "goals" ? "nowy cel finansowy" : "nową przyszłą płatność"}: ${groupItem.name} o wartości ${groupItem.value} ${group.currency}.`);

  res.status(200).json({ 
    ...groupItem._doc,
    user: await transformUser(groupItem.user)
  }); 
});

export const updateGroupItem = type => asyncHandler(async (req, res) => {
  const { id } = req.params;

  const group = await checkGroup(res, id, req.user._id);
  
  const { id: itemId, value, description, category, name, targetDate, date } = req.body;
  const groupItem = await checkGroupItem(res, itemId, type);

  if(`${groupItem.user._id}` !== `${req.user._id}` && !group.checkAdmin(req.user._id)){
    res.status(403);
    throw new Error("Użytkownik nie posiada uprawnień do wykonania operacji edycji");
  }

  const oldValue = groupItem.value;
  const oldName = groupItem.name;
  const oldCategory = groupItem.category;

  groupItem.value = value || groupItem.value;
  groupItem.description = description || groupItem.description;

  if(type === "income" || type === "expenses"){
    groupItem.category = category || groupItem.category;
    groupItem.date = date || groupItem.date;
  }else{
    groupItem.name = name || groupItem.name;
    groupItem.targetDate = targetDate || groupItem.targetDate;
  } 

  await groupItem.save();
  await group.addNotification(`Użytkownik ${req.user.name} ${req.user.surname} zaktualizował ${getTypeName(type)} o wartości ${oldValue} ${group.currency} (${oldName || CATEGORIES[oldCategory]}) na ${groupItem.value} ${group.currency} (${groupItem.name || CATEGORIES[groupItem.category]})`);

  res.status(200).json({
    ...groupItem._doc,
    user: await transformUser(groupItem.user)
  });
});

export const deleteGroupItem = type => asyncHandler(async (req, res) => {
  const { id } = req.params;

  const group = await checkGroup(res, id, req.user._id);

  const { id: itemId } = req.body;
  const groupItem = await checkGroupItem(res, itemId, type);

  if(`${groupItem.user._id}` !== `${req.user._id}` && !group.checkAdmin(req.user._id)){
    res.status(403);
    throw new Error("Użytkownik nie posiada uprawnień do wykonania operacji usunięcia"); 
  }

  group[type] = group[type].filter(groupItemId => `${groupItemId}` !== `${itemId}`);

  await group.save();
  await group.addNotification(`Użytkownik ${req.user.name} ${req.user.surname} usunął ${getTypeName(type)} o wartości ${groupItem.value} ${group.currency} (${groupItem.name || CATEGORIES[groupItem.category]}).`);

  await groupItem.deleteOne();
  
  res.status(204).json({ message: 'Successfully deleted' });
});

export const addUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const group = await checkGroup(res, id, req.user._id);

  if(!group.checkAdmin(req.user._id)){
    res.status(403);
    throw new Error("Użytkownik nie posiada uprawnień do wykonania operacji dodania użytkownika do grupy");
  }
  
  const { email } = req.body;
  const user = await User.findOne({ email });

  if(!user){
    res.status(404);
    throw new Error(`Nie istnieje użytkownik o adresie email ${email}`);
  }

  if(group.checkUser(user._id)){
    res.status(400);
    throw new Error(`Użytkownik ${user.name} ${user.surname} już należy do grupy`);
  }

  group.users = [...group.users, user._id];
  await group.save();

  user.groups = [...user.groups, group._id];

  await user.save();
  await group.addNotification(`Użytkownik ${req.user.name} ${req.user.surname} dodał nowego użytkownika ${user.name} ${user.surname} do grupy.`);

  res.status(200).json({ 
    users: await transformUsers(group.users)
  });
});

export const changeUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const group = await checkGroup(res, id, req.user._id);

  if(!group.checkAdmin(req.user._id)){
    res.status(403);
    throw new Error("Użytkownik nie posiada uprawnień do zmiany uprawnień użytkownika");
  }

  //role: admins || users
  const { id: userId, role } = req.body;
  const user = await findUser(req, userId);

  if(!group.checkUser(user._id)){
    res.status(400);
    throw new Error(`Użytkownik o id: ${user._id} nie należy do grupy`);
  }

  if(role === "users" && group.admins.length === 1){
    res.status(400);
    throw new Error('Przed zmianą uprawnień z admina na zwykłego użytkownika należy przekazać uprawnienia admina innemu użytkownikowi');
  }

  const oldRole = role === "users" ? "admins" : "users";

  group[oldRole] = group[oldRole].filter(uId => `${uId}` !== `${user._id}`);
  group[role] = [...group[role], user._id];
  
  await group.save();
  await group.addNotification(`Użytkownik ${req.user.name} ${req.user.surname} zmienił uprawnienia użytkownika ${user.name} ${user.surname} na ${role === "admins" ? 'admina' : 'zwykłego użytkownika'}.`);

  res.status(200).json({ 
    users: await transformUsers(group.users),
    admins: await transformUsers(group.admins)
  });
});

export const removeUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const group = await checkGroup(res, id, req.user._id);

  const { id: userId } = req.body;

  if(!group.checkAdmin(req.user._id) && `${userId}` !== `${req.user._id}`){
    res.status(403);
    throw new Error("Użytkownik nie posiada uprawnień do usunięcia użytkownika z grupy");
  }

  const user = await findUser(req, userId);

  if(!group.checkUser(user._id)){
    res.status(400);
    throw new Error(`Użytkownik o id: ${user._id} nie należy do grupy`);
  }
  
  if(group.users.length === 0 && group.admins.length === 1){
    res.status(400);
    throw new Error('Grupa posiada tylko jednego użytkownika. Możliwą operacją jest usunięcie grupy.');
  }

  if(group.admins.length === 1 && `${group.admins[0]}` === `${user._id}`){
    res.status(400);
    throw new Error('Przed usunięciem użytkownika z grupy (admina) należy przekazać uprawnienia admina innemu użytkownikowi');
  }
  
  const role = group.admins.findIndex(uId => `${uId}` === `${user._id}`) >= 0 ? 'admins' : 'users';
  group[role] = group[role].filter(uId => `${uId}` !== `${user._id}`);
  await group.save();

  user.groups = user.groups.filter(gId => `${gId}` !== `${group._id}`);
  await user.save();

  await group.addNotification(`Użytkownik ${req.user.name} ${req.user.surname} usunął użytkownika ${user.name} ${user.surname} z grupy.`);

  if(`${user._id}` === `${req.user._id}`){
    res.status(200).json({ message: 'Użytkownik został usunięty z grupy' });
  }else{
    res.status(200).json({ 
      users: await transformUsers(group.users),
      admins: await transformUsers(group.admins)
    });
  }
});