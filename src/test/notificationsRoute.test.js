// ./tests/notificationsRoute.test.js
import request from 'supertest';
import express from 'express';
import fs from 'fs';
import notificationsRoute from '../src/routes/notifications.js'; // Adjust the path to your notifications route

jest.mock('fs'); // Mock the 'fs' module

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use('/api/notifications', notificationsRoute);

describe('GET /api/notifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return notifications when the file is read successfully', async () => {
    // Mock the content of the file
    const mockNotifications = JSON.stringify([
      { id: 1, title: 'Test Notification', message: 'This is a test notification' },
    ]);

    // Mock fs.readFile to simulate successful file reading
    fs.readFile.mockImplementation((path, encoding, callback) => {
      callback(null, mockNotifications);
    });

    const response = await request(app).get('/api/notifications');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, title: 'Test Notification', message: 'This is a test notification' },
    ]);
  });

  it('should return 500 if there is an error reading the file', async () => {
    // Mock fs.readFile to simulate an error
    fs.readFile.mockImplementation((path, encoding, callback) => {
      callback(new Error('File read error'), null);
    });

    const response = await request(app).get('/api/notifications');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Error reading notifications data' });
  });

  it('should return 500 if there is an error parsing the notifications file', async () => {
    // Mock fs.readFile to return invalid JSON
    fs.readFile.mockImplementation((path, encoding, callback) => {
      callback(null, 'INVALID JSON');
    });

    const response = await request(app).get('/api/notifications');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Error parsing notifications data' });
  });
});
