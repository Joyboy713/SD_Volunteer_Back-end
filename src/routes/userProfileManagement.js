//Shinelle file
const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileManagementController');

// Route to get user profile by username
router.get('/:username', userProfileController.getProfile);

// Route to update user profile
router.post('/update', userProfileController.updateProfile);

module.exports = router;
