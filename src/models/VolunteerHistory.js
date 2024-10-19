import mongoose from 'mongoose';

const volunteerHistorySchema = new mongoose.Schema({
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  volunteerName: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
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
  matchDate: {
    type: Date,
    default: Date.now,
  },
});

const VolunteerHistory = mongoose.model('VolunteerHistory', volunteerHistorySchema);
export default VolunteerHistory;
