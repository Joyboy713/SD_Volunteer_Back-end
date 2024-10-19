import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js'; // Adjust this path as necessary

const router = express.Router();

// User login route
router.post('/api/users/login', async (req, res) => {
  console.log('Received login request:', req.body);

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found for email:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('User found:', user);

    //Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Password does not match for email:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('Password match successful');

    // Send success response
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Server error during login:', error);
    res.status(500).json({ message: 'Server error' });u
  }
});

//module.exports = router;
export default router;
