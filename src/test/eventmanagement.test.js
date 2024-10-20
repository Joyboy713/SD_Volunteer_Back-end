import express from 'express';
import request from 'supertest';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import Event from '../models/Event.js';

// Mock the Event model
jest.mock('../models/Event.js');

const app = express();
app.use(express.json());

// Mock routes for testing purposes
app.get('/events', getEvents);
app.post('/events', createEvent);
app.put('/events/:id', updateEvent);
app.delete('/events/:id', deleteEvent);

describe('Event Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /events', () => {
    it('should create a new event', async () => {
      const mockEvent = {
        eventName: 'New Event',
        eventDescription: 'A new event description',
        location: 'Location 1',
        eventDate: '2024-10-20',
        urgency: 'High',
        requiredSkills: ['Skill 1'],
      };

      // Mock the save method of the Event schema
      Event.prototype.save.mockResolvedValue(mockEvent);

      const res = await request(app).post('/events').send(mockEvent);

      // Check that the correct status code and body are returned
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(mockEvent);
    });

    it('should return a 500 error if creating an event fails', async () => {
      Event.prototype.save.mockRejectedValue(new Error('Database error'));

      const res = await request(app).post('/events').send({
        eventName: 'New Event',
        eventDescription: 'A new event description',
      });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('message', 'Error creating event');
    });
  });
});