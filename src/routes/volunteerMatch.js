import express from 'express';
import mongoose from 'mongoose'; // Import mongoose
import User from '../models/User.js';
import Event from '../models/Event.js';
import VolunteerHistory from '../models/VolunteerHistory.js';

const router = express.Router();

// Fetch matched volunteers for an event with prioritization based on skills and preferences
router.get('/matchByEvent/:eventId', async (req, res) => {
  const { eventId } = req.params;

  // Validate the eventId
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  try {
    // Find the event by its ID
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Extract the required skills for the event
    const { requiredSkills } = event;

    // Find volunteers whose skills or preferences match the event's required skills
    const matchedVolunteers = await User.find({
      $or: [
        // Match based on volunteering preferences
        ...requiredSkills.map(skill => ({
          [`volunteeringPreferences.${skill}`]: {
            $in: ['Would love to!', 'Would like to.', "Wouldn't mind helping."],
          },
        })),
        // Match based on skills array
        { skills: { $in: requiredSkills } },
      ],
    });

    // Sort the matched volunteers based on preference priority and skills match
    const sortedVolunteers = matchedVolunteers.sort((a, b) => {
      const priority = {
        "Would love to!": 1,
        "Would like to.": 2,
        "Wouldn't mind helping.": 3,
      };

      // Determine the priority of each volunteer for the event's required skills
      const aPreference = requiredSkills
        .map(skill => priority[a.volunteeringPreferences[skill]] || 4)
        .sort()[0];
      const bPreference = requiredSkills
        .map(skill => priority[b.volunteeringPreferences[skill]] || 4)
        .sort()[0];

      // Determine if the volunteer's skills match the event's required skills
      const aSkillsMatch = a.skills.some(skill => requiredSkills.includes(skill));
      const bSkillsMatch = b.skills.some(skill => requiredSkills.includes(skill));

      // Sort by preference priority first, then by skills match
      if (aPreference === bPreference) {
        return bSkillsMatch - aSkillsMatch; // If preferences are equal, prioritize based on skills match
      }
      return aPreference - bPreference; // Otherwise, sort by preference priority
    });

    res.status(200).json(sortedVolunteers);
  } catch (error) {
    console.error('Error fetching matched volunteers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save a volunteer-event match with prioritization
router.post('/saveMatch', async (req, res) => {
  const { eventId, volunteerIds } = req.body;

  // Validate the eventId
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  try {
    // Find the event by its ID
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Find volunteers using their IDs
    const volunteers = await User.find({ _id: { $in: volunteerIds } });

    // Sort volunteers based on their preferences for the event's required skills
    const sortedVolunteers = volunteers.sort((a, b) => {
      const priority = {
        "Would love to!": 1,
        "Would like to.": 2,
        "Wouldn't mind helping.": 3,
      };

      const aPreference = event.requiredSkills
        .map(skill => priority[a.volunteeringPreferences[skill]] || 4)
        .sort()[0];
      const bPreference = event.requiredSkills
        .map(skill => priority[b.volunteeringPreferences[skill]] || 4)
        .sort()[0];

      // Sort volunteers by their highest preference
      return aPreference - bPreference;
    });

    // Save the sorted matched volunteers into the VolunteerHistory collection
    const savedMatches = await Promise.all(
      sortedVolunteers.map(async (volunteer) => {
        const newMatch = new VolunteerHistory({
          volunteerId: volunteer._id,
          eventId,
          eventName: event.eventName,
          volunteerName: `${volunteer.firstName} ${volunteer.lastName}`,
          eventDate: event.eventDate,
          location: event.location,
          urgency: event.urgency,
          requiredSkills: event.requiredSkills,
          matchDate: new Date(),
        });

        return newMatch.save();
      })
    );

    res.status(201).json({
      message: 'Volunteers matched, prioritized, and saved to the history successfully!',
      matches: savedMatches,
    });
  } catch (error) {
    console.error('Error saving volunteer-event matches:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
