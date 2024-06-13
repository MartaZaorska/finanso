import { Router } from 'express';

import {
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  createTransaction,
  createGroupItem,
  updateGroupItem, 
  deleteGroupItem,
  addUser, 
  changeUserRole,
  removeUser,
  getNotifications
} from '../controllers/group.js';

const router = Router();

router.post("/", createGroup);

router.route("/:id")
  .get(getGroup)
  .put(updateGroup)
  .delete(deleteGroup);

router.route("/:id/user")
  .post(addUser)
  .put(changeUserRole)
  .delete(removeUser);

router.get("/:id/notifications", getNotifications);

router.route("/:id/income")
  .post(createTransaction("income"))
  .put(updateGroupItem("income"))
  .delete(deleteGroupItem("income"));

router.route("/:id/expenses")
  .post(createTransaction("expenses"))
  .put(updateGroupItem("expenses"))
  .delete(deleteGroupItem("expenses"));

router.route("/:id/goals")
  .post(createGroupItem("goals"))
  .put(updateGroupItem("goals"))
  .delete(deleteGroupItem("goals"));

router.route("/:id/payments")
  .post(createGroupItem("payments"))
  .put(updateGroupItem("payments"))
  .delete(deleteGroupItem("payments")); 

export default router