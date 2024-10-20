import express from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';

const router = express.Router();

// Get all events
router.get('/', getEvents);

// Create a new event
router.post('/', createEvent);

// Update an event (optional)
router.put('/:id', updateEvent);

// Delete an event (optional)
router.delete('/:id', deleteEvent);

export default router;