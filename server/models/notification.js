import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  value: String
}, {
  timestamps: true
});

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;