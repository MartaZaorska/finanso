import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import Group from '../models/group.js';

import { transformGroups, deleteGroupComponents } from './transform.js';

const generateToken = (res, data) => {
  const token = jwt.sign(data, process.env.SECRET, { expiresIn: '6h' });

  res.cookie('auth', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 6 * 60 * 60 * 1000
  });
}

export const register = asyncHandler(async (req, res) => {
  const { name, surname, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if(userExists) {
    res.status(400);
    throw new Error("Użytkownik o podanym adresie e-mail już istnieje");
  }

  const hashedPassword = await User.hashPassword(password);
  const user = await User.create({ name, surname, email, password: hashedPassword, groups: [] });
  
  if(!user){
    res.status(400);
    throw new Error("Nieprawidłowe dane");
  }

  const group = await Group.create({ name: 'Moje finanse', currency: 'PLN', admins: [user._id] });

  if(!group){
    res.status(400);
    throw new Error("Wystąpił problem z utworzeniem obiektu Group");
  }

  user.groups = [group._id];
  await (await user.save()).populate("groups");

  generateToken(res, { userId: user._id });
  res.status(201).json({ 
    ...user._doc, 
    password: null, 
    groups: await transformGroups(user.groups) 
  });
});


export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate("groups");

  if(!user){
    res.status(400);
    throw new Error("Użytkownik o podanym adresie e-mail nie istnieje");
  }

  if(!(await user.checkPassword(password))){
    res.status(400);
    throw new Error("Nieprawidłowe hasło");
  }

  generateToken(res, { userId: user._id });
  res.status(200).json({ 
    ...user._doc, 
    password: null,
    groups: await transformGroups(user.groups) 
  });
});

export const logout = (req, res) => {
  res.cookie('auth', '', {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
    sameSite: 'None'
  });

  res.status(200).json({ message: 'Wylogowano pomyślnie' });
};

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password").populate("groups");

  if(!user){
    res.status(404);
    throw new Error("Użytkownik nie istnieje");
  }

  res.status(200).json({ 
    ...user._doc, 
    groups: await transformGroups(user.groups) 
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if(!user){
    res.status(401);
    throw new Error("Użytkownik nie istnieje");
  }

  const { name, surname, email, password } = req.body;

  if(email && email !== user.email){
    const userExists = await User.findOne({ email });

    if(userExists){
      res.status(400);
      throw new Error('Użytkownik o podanym adresie e-mail już istnieje');
    }
  }

  user.email = email || user.email;
  user.name = name || user.name;
  user.surname = surname || user.surname;

  if(password){ 
    const hashedPassword = await User.hashPassword(password);
    user.password = hashedPassword;  
  }

  await (await user.save()).populate("groups");

  res.status(200).json({ 
    ...user._doc, 
    password: null, 
    groups: await transformGroups(user.groups) 
  });
});

export const deleteProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("groups");

  if(!user){
    res.status(401);
    throw new Error("Użytkownik nie istnieje");
  }


  user.password = null;
  user.email = null;

  for(const group of user.groups){ 
    if(group.admins.length === 1 && `${group.admins[0]}` === `${user._id}`){
      await deleteGroupComponents(group);
    }
  }

  user.groups = [];
  await user.save();

  res.cookie('auth', '', {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
    sameSite: 'None'
  });

  res.status(200).json({
    message: 'Usunięto konto pomyślnie'
  });
});