const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Skill = mongoose.model('Skill');
// Get all skills
router.get('/skills', async (req, res) => {
try {
const skills = await Skill.find();
res.json(skills);
} catch (err) {
res.status(500).json({ error: err.message });
}
});

// Create a new skill
router.post('/skills', async (req, res) => {
const { name, description } = req.body;

try {
const newSkill = new Skill({
name,
description
});

await newSkill.save();
res.status(201).json(newSkill);
} catch (err) {
res.status(400).json({ error: err.message });
}
});

// Update a skill
router.put('/skills/:id', async (req, res) => {
const { id } = req.params;
const { name, description } = req.body;

try {
const skill = await Skill.findByIdAndUpdate(id, { name, description }, { new: true });
if (!skill) {
return res.status(404).json({ message: 'Skill not found' });
}
res.json(skill);
} catch (err) {
res.status(400).json({ error: err.message });
}
});

// Delete a skill
router.delete('/skills/:id', async (req, res) => {
const { id } = req.params;

try {
const skill = await Skill.findByIdAndDelete(id);
if (!skill) {
return res.status(404).json({ message: 'Skill not found' });
}
res.json({ message: 'Skill deleted' });
} catch (err) {
res.status(400).json({ error: err.message });
}
});

module.exports = router;