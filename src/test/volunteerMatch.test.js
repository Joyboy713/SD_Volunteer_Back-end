import request from 'supertest';
import express from 'express';
import volunteerMatchRoutes from '../routes/volunteerMatch.js';
import User from '../models/User.js';
import Event from '../models/Event.js';
import VolunteerHistory from '../models/VolunteerHistory.js';

// Mock the models
jest.mock('../models/User');
jest.mock('../models/Event');
jest.mock('../models/VolunteerHistory');

const app = express();
app.use(express.json());
app.use('/api/volunteerMatch', volunteerMatchRoutes);

describe('Volunteer Matching API', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test to avoid interference
  });

  test('GET /api/volunteerMatch/matchByEvent/:eventId should return matched volunteers', async () => {
    // Mock the Event.findById method to return a fake event
    Event.findById.mockResolvedValue({
      _id: '64b8f9c01234567890abcdef', // Valid ObjectId-like string
      requiredSkills: ['Teamwork', 'Safety Awareness'],
    });

    // Mock the User.find method to return a list of volunteers
    User.find.mockResolvedValue([
      {
        _id: '64b8f9c01234567890abc123',
        firstName: 'John',
        lastName: 'Doe',
        skills: ['Teamwork'],
        volunteeringPreferences: {
          tshirts: 'Would love to!',
          ticketSales: 'Would like to.',
        },
      },
      {
        _id: '64b8f9c01234567890abc456',
        firstName: 'Jane',
        lastName: 'Smith',
        skills: ['Safety Awareness'],
        volunteeringPreferences: {
          tshirts: "Wouldn't mind helping.",
        },
      },
    ]);

    const response = await request(app).get('/api/volunteerMatch/matchByEvent/64b8f9c01234567890abcdef');

    // Assertions to ensure correct response
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('firstName', 'John');
    expect(response.body[0]).toHaveProperty('lastName', 'Doe');
  });

  test('POST /api/volunteerMatch/saveMatch should save volunteer matches', async () => {
    // Mock the Event.findById method to return a fake event
    Event.findById.mockResolvedValue({
      _id: '64b8f9c01234567890abcdef',
      eventName: 'Test Event',
      requiredSkills: ['Teamwork'],
      eventDate: new Date(),
      location: 'Test Location',
      urgency: 'High',
    });

    // Mock the User.find method to return a list of volunteers
    User.find.mockResolvedValue([
      {
        _id: '64b8f9c01234567890abc123',
        firstName: 'John',
        lastName: 'Doe',
        skills: ['Teamwork'],
        volunteeringPreferences: {
          tshirts: 'Would love to!',
        },
      },
    ]);

    // Mock the save method for VolunteerHistory to simulate saving matches
    VolunteerHistory.prototype.save = jest.fn().mockResolvedValue({
      _id: 'history123',
      volunteerId: '64b8f9c01234567890abc123',
      eventId: '64b8f9c01234567890abcdef',
      eventName: 'Test Event',
      volunteerName: 'John Doe',
      eventDate: new Date(),
      location: 'Test Location',
      urgency: 'High',
      requiredSkills: ['Teamwork'],
      matchDate: new Date(),
    });

    const response = await request(app)
      .post('/api/volunteerMatch/saveMatch')
      .send({
        eventId: '64b8f9c01234567890abcdef',
        volunteerIds: ['64b8f9c01234567890abc123'],
      });

    // Assertions to ensure correct response
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Volunteers matched, prioritized, and saved to the history successfully!');
    expect(response.body.matches).toBeInstanceOf(Array);
    expect(response.body.matches[0]).toHaveProperty('volunteerId', '64b8f9c01234567890abc123');
    expect(response.body.matches[0]).toHaveProperty('eventId', '64b8f9c01234567890abcdef');
  });

  test('GET /api/volunteerMatch/matchByEvent/:eventId should return 400 for invalid event ID', async () => {
    const response = await request(app).get('/api/volunteerMatch/matchByEvent/invalidID');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid event ID');
  });

  test('POST /api/volunteerMatch/saveMatch should return 400 for invalid event ID', async () => {
    const response = await request(app)
      .post('/api/volunteerMatch/saveMatch')
      .send({
        eventId: 'invalidID',
        volunteerIds: ['64b8f9c01234567890abc123'],
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid event ID');
  });
});
