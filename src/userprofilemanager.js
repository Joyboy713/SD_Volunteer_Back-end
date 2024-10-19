//Shinelle file
import express from 'express';
import bcrypt from 'bcrypt';
import multer from 'multer';
import jwt from 'jsonwebtoken';  
import User from '../models/User.js'; 
import { authMiddleware } from '../Middleware/authmiddleware.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ES module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure that the directory exists for profile pictures
const uploadDir = path.join(__dirname, '../uploads/profilePictures');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route for updating user profile, including profile picture
router.put('/profile', authMiddleware, upload.single('profilePicture'), async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('Uploaded File:', req.file);

  const {
    fullName,
    skills,
    preferences,
    availability,
  } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile details
    user.fullName = fullName || user.fullName;
    if (req.file) {
      user.profilePicture = `/uploads/profilePictures/${req.file.filename}`;
    }
    user.skills = skills ? JSON.parse(skills) : user.skills;
    user.preferences = preferences || user.preferences;
    user.availability = availability ? JSON.parse(availability) : user.availability;

    await user.save();
    console.log('User after update:', user);

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route for uploading profile pictures separately
router.post('/profile/upload', authMiddleware, upload.single('profilePicture'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user profile picture path
    user.profilePicture = `/uploads/profilePictures/${req.file.filename}`;
    await user.save();

    res.json({ message: 'Profile picture uploaded successfully', user });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;