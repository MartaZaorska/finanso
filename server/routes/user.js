import { Router } from 'express';
import auth from '../middleware/auth.js';

import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  deleteProfile
} from '../controllers/user.js';

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router
  .route("/")
  .get(auth, getProfile)
  .put(auth, updateProfile) 
  .delete(auth, deleteProfile);

export default router