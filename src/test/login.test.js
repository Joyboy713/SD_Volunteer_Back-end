// ./tests/login.test.js
import request from 'supertest';
import express from 'express';
import User from '../src/models/User.js'; // Adjust path as necessary
import loginRoute from '../src/routes/login.js'; // Adjust path as necessary

// Mock the User model
jest.mock('../src/models/User.js');

const app = express();
app.use(express.json());
app.use('/api/login', loginRoute);

describe('POST /api/login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if the user is not found', async () => {
    // Mock User.findOne to return null (user not found)
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email not found');
  });

  it('should return 400 if the password is incorrect', async () => {
    // Mock User.findOne to return a user
    User.findOne.mockResolvedValue({
      email: 'test@example.com',
      password: 'password123', // Mock user with password (in this case, it's plain text)
    });

    const response = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Wrong password');
  });

  it('should return 200 and login the user if the credentials are correct', async () => {
    // Mock User.findOne to return a valid user
    User.findOne.mockResolvedValue({
      _id: 'userId123',
      email: 'test@example.com',
      password: 'password123', // In real life, this would be hashed, but we're mocking
    });

    const response = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.user).toEqual({
      _id: 'userId123',
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should return 500 if there is a server error', async () => {
    // Mock User.findOne to throw an error
    User.findOne.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Server error');
  });
});
