// Hardcoded user profile data for now
let userProfile = {
    username: 'testuser',
    location: 'New York',
    skills: ['JavaScript', 'Node.js'],
    preferences: { emailNotifications: true },
    availability: 'full-time',
};

exports.getProfile = (req, res) => {
    const { username } = req.params;
    if (username === userProfile.username) {
        res.status(200).json(userProfile);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

exports.updateProfile = (req, res) => {
    const { username, location, skills, preferences, availability } = req.body;
    // Simple update logic, in reality, this would be more complex and involve a database
    if (username === userProfile.username) {
        userProfile = { ...userProfile, location, skills, preferences, availability };
        res.status(200).json({ message: 'Profile updated successfully', userProfile });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
