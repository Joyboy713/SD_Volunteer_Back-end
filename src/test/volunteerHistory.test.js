import express from 'express';
import request from 'supertest';
import volunteerHistoryRoutes from '../routes/volunteerHistory';
import VolunteerHistory from '../models/VolunteerHistory';

// Mock the Mongoose model
jest.mock('../models/VolunteerHistory');

const app = express();
app.use(express.json());
app.use('/api/volunteerHistory', volunteerHistoryRoutes);

describe('Volunteer History API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/volunteerHistory/ should return all history entries', async () => {
    // Mock data for the test
    const mockHistory = [
      {
        _id: 'history123',
        volunteerId: 'volunteer123',
        eventId: 'event123',
        eventName: 'Test Event',
        volunteerName: 'John Doe',
        eventDate: new Date(),
        location: 'Location A',
        urgency: 'High',
        requiredSkills: ['Teamwork', 'Safety Awareness'],
        matchDate: new Date(),
      },
      {
        _id: 'history456',
        volunteerId: 'volunteer456',
        eventId: 'event456',
        eventName: 'Another Event',
        volunteerName: 'Jane Doe',
        eventDate: new Date(),
        location: 'Location B',
        urgency: 'Low',
        requiredSkills: ['Leadership', 'Creativity'],
        matchDate: new Date(),
      },
    ];

    // Mock the `find` method to return the mock data
    VolunteerHistory.find.mockResolvedValue(mockHistory);

    // Make a request to the endpoint
    const response = await request(app).get('/api/volunteerHistory/');

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty('volunteerName', 'John Doe');
    expect(response.body[1]).toHaveProperty('eventName', 'Another Event');
  });

  test('GET /api/volunteerHistory/ should handle server errors', async () => {
    // Mock the `find` method to throw an error
    VolunteerHistory.find.mockRejectedValue(new Error('Database error'));

    // Make a request to the endpoint
    const response = await request(app).get('/api/volunteerHistory/');

    // Assertions
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Server error');
  });
});
