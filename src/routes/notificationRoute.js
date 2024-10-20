// ./src/routes/notifications.js (backend)
import express from 'express';
import Notification from '../models/NotificationModel.js'; // Adjust path as needed
import { authMiddleware } from '../Middleware/authmiddleware.js'; // For authentication
import User from '../models/User.js';

const router = express.Router();

// Get all notifications for a specific user
router.get('/', //authMiddleware, 
    async (req, res) => {
    const { token } = req.body;

  try {
    const user = await User.findOne({token});
    console.log(user._id);
    const notifications = await Notification.find({ userId: user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new notification
router.post('/', //authMiddleware, 
    async (req, res) => {
  const { title, message, eventId } = req.body;

  try {
    const newNotification = new Notification({
      userId: req.user.id,  // From the authenticated user
      title,
      message,
      eventId,
    });

    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
