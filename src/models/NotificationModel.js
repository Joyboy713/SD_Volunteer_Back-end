// ./src/models/Notification.js (backend)
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the volunteer
  title: { type: String, required: true }, // Title of the notification
  message: { type: String, required: true }, // Notification message
  isRead: { type: Boolean, default: false }, // Status if notification is read or not
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }, // Optional reference to event
  createdAt: { type: Date, default: Date.now }, // When the notification was created
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
