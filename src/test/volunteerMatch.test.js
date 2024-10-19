import request from 'supertest';
import express from 'express';
import volunteerMatchRoutes from '../routes/volunteerMatch';
import User from '../models/User';
import Event from '../models/Event';
import VolunteerHistory from '../models/VolunteerHistory';

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
    // Mock the Event.findById method
    Event.findById.mockResolvedValue({
      _id: 'event123',
      requiredSkills: ['Teamwork', 'Safety Awareness'],
    });

    // Mock the User.find method
    User.find.mockResolvedValue([
      {
        _id: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        skills: ['Teamwork'],
        volunteeringPreferences: {
          tshirts: 'Would love to!',
          ticketSales: 'Would like to.',
          raffleTicketSales: "Wouldn't mind helping.",
          trafficParking: 'Not this area.',
          cleanupGrounds: 'Would like to.',
        },
      },
    ]);

    const response = await request(app).get('/api/volunteerMatch/matchByEvent/event123');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('firstName', 'John');
  });

  test('POST /api/volunteerMatch/saveMatch should save volunteer matches', async () => {
    // Mock the Event.findById method
    Event.findById.mockResolvedValue({
      _id: 'event123',
      eventName: 'Test Event',
      requiredSkills: ['Teamwork'],
      eventDate: new Date(),
      location: 'Location A',
      urgency: 'High',
    });

    // Mock the User.find method
    User.find.mockResolvedValue([
      {
        _id: 'user123',
        firstName: 'Jane',
        lastName: 'Doe',
        volunteeringPreferences: {
          tshirts: 'Would love to!',
        },
      },
    ]);

    // Mock the save method for VolunteerHistory
    VolunteerHistory.prototype.save = jest.fn().mockResolvedValue({
      _id: 'history123',
      volunteerId: 'user123',
      eventId: 'event123',
    });

    const response = await request(app)
      .post('/api/volunteerMatch/saveMatch')
      .send({
        eventId: 'event123',
        volunteerIds: ['user123'],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Volunteers matched, prioritized, and saved to the history successfully!');
    expect(response.body.matches).toBeInstanceOf(Array);
    expect(response.body.matches[0]).toHaveProperty('volunteerId', 'user123');
  });
});
