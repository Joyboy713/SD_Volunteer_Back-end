import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  eventDescription: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  urgency: {
    type: String,
    required: true,
  },
  requiredSkills: {
    type: [String],
    required: true,
  },
});

const Event = mongoose.model('Event', eventSchema);

export default Event;