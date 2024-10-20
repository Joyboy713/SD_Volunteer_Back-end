// ./tests/eventController.test.js
import { assignVolunteerToEvent } from '../src/controllers/eventController.js';
import User from '../src/models/User.js';
import Event from '../src/models/Event.js';
import Notification from '../src/models/Notification.js';

// Mock the models
jest.mock('../src/models/User.js');
jest.mock('../src/models/Event.js');
jest.mock('../src/models/Notification.js');

describe('assignVolunteerToEvent', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear any mocks between tests
  });

  it('should throw an error if volunteer is not found', async () => {
    // Mock the User.findById to return null
    User.findById.mockResolvedValue(null);

    // Mock the Event.findById to return an event
    Event.findById.mockResolvedValue({ eventName: 'STEM Event' });

    // Expect the function to throw an error
    await expect(assignVolunteerToEvent('volunteerId', 'eventId')).rejects.toThrow('Volunteer or Event not found');
  });

  it('should throw an error if event is not found', async () => {
    // Mock the User.findById to return a valid user
    User.findById.mockResolvedValue({ email: 'volunteer@example.com' });

    // Mock the Event.findById to return null
    Event.findById.mockResolvedValue(null);

    // Expect the function to throw an error
    await expect(assignVolunteerToEvent('volunteerId', 'eventId')).rejects.toThrow('Volunteer or Event not found');
  });

  it('should create and save a notification if volunteer and event are found', async () => {
    // Mock the User.findById to return a valid user
    User.findById.mockResolvedValue({ _id: 'volunteerId', email: 'volunteer@example.com' });

    // Mock the Event.findById to return a valid event
    Event.findById.mockResolvedValue({
      _id: 'eventId',
      eventName: 'STEM Event',
      eventDate: new Date('2024-10-25'),
    });

    // Mock the Notification's save method to resolve successfully
    Notification.prototype.save = jest.fn().mockResolvedValue(true);

    // Call the function
    await assignVolunteerToEvent('volunteerId', 'eventId');

    // Verify that a notification was created with correct data
    expect(Notification).toHaveBeenCalledWith({
      userId: 'volunteerId',
      title: 'Assigned to Event: STEM Event',
      message: 'You have been assigned to the event: STEM Event happening on Fri Oct 25 2024 00:00:00 GMT+0000 (Coordinated Universal Time)',
      eventId: 'eventId',
    });

    // Ensure that the notification was saved
    expect(Notification.prototype.save).toHaveBeenCalled();
  });
});
