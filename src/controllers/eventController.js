import Event from '../models/Event.js';

// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving events' });
  }
};

// Create a new event
export const createEvent = async (req, res) => {
  const { eventName, eventDescription, location, eventDate, urgency, requiredSkills } = req.body;

  try {
    const newEvent = new Event({
      eventName,
      eventDescription,
      location,
      eventDate,
      urgency,
      requiredSkills,
    });
    await newEvent.save(); // Save the new event to the database
    res.status(201).json(newEvent); // Return the saved event
  } catch (error) {
    res.status(500).json({ message: 'Error creating event' });
  }
};


// Update an existing event
export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { eventName, eventDescription, location, eventDate, urgency, requiredSkills } = req.body;
  
    try {
      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        { eventName, eventDescription, location, eventDate, urgency, requiredSkills },
        { new: true } // Return the updated document
      );
      
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      res.json(updatedEvent); // Return the updated event
    } catch (error) {
      res.status(500).json({ message: 'Error updating event', error });
    }
  };  

// Delete an event (optional)
export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    await Event.findByIdAndDelete(id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event' });
  }
};
