// ./src/controllers/eventController.js (backend)
import express from 'express';
import Event from './models/Event.js';
import Notification from './models/Event.js';
import User from './models/User.js'; // Adjust paths as necessary

const router = express.Router();

export const assignVolunteerToEvent = async (volunteerId, eventId) => {
  try {
    const volunteer = await User.findById(volunteerId);
    const event = await Event.findById(eventId);

    if (!volunteer || !event) {
      throw new Error('Volunteer or Event not found');
    }

    // Create notification
    const notification = new Notification({
      userId: volunteerId,
      title: `Assigned to Event: ${event.eventName}`,
      message: `You have been assigned to the event: ${event.eventName} happening on ${event.eventDate}`,
      eventId,
    });

    await notification.save();
    console.log(`Notification sent to ${volunteer.email}`);
  } catch (error) {
    console.error('Error assigning volunteer to event:', error);
  }
};

export default router;
