import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

import User from '../models/user.js';

const auth = asyncHandler(async (req, res, next) => {
  let token = req.cookies.auth;
  
  if(!token){
    res.status(401);
    throw new Error("Brak autoryzacji");
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded.userId).select('name surname email');
    
    if(!user){
      res.status(401);
      throw new Error("Brak autoryzacji");
    }

    req.user = user;
    next(); 
  }catch(error){
    res.status(401);
    throw new Error("Brak autoryzacji");
  }
});

export default auth;