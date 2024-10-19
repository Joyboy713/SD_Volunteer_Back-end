const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();
    console.log('Received email:', normalizedEmail);

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.error('User not found');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Password does not match');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('JWT token generated:', token);

    // Send token and user data
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


/*
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { findOne } from '../models/User';

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();
    console.log('Received email:', normalizedEmail);

    // Find user by email
    const user = await findOne({ email: normalizedEmail });
    if (!user) {
      console.error('User not found');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('User found:', user.email);

    // Compare password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      console.error('Password does not match');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('Password matched successfully');

    // Generate JWT token
    const token = sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('JWT token generated:', token);

    // Send token and user data
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
*/