import express from 'express';
import VolunteerHistory from '../models/VolunteerHistory.js';

const router = express.Router();

// Get all volunteer history entries
router.get('/', async (req, res) => {
  try {
    const history = await VolunteerHistory.find();
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching volunteer history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
