const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');

// Update user's role and status
router.put('/users/:id', async (req, res) => {
try {
const { id } = req.params;
const { role, status } = req.body;

const user = await User.findByIdAndUpdate(id, { role, status }, { new: true });

if (!user) {
return res.status(404).json({ error: 'User not found' });
}

res.json(user);
} catch (error) {
console.error('Error updating user:', error);
res.status(500).json({ error: 'Internal server error' });
}
});

// Get all users
router.get('/users', async (req, res) => {
try {
const users = await User.find();
res.json(users);
} catch (error) {
console.error('Error fetching users:', error);
res.status(500).json({ error: 'Internal server error' });
}
});

module.exports = router;