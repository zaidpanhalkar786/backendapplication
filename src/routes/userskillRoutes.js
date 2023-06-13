const express = require('express');
const router = express.Router();
const Employee = require('./model');

// Route to save the primary skill for an employee
router.post('/primarySkill', (req, res) => {
const { email, skillName, yearsOfExperience, certification } = req.body;

Employee.findOneAndUpdate(
{ email: email },
{ $set: { 'primarySkill': { skillName, yearsOfExperience, certification } } },
{ new: true, upsert: true },
(err, doc) => {
if (err) {
console.error(err);
res.status(500).send('Internal Server Error');
} else {
res.status(200).json(doc);
}
}
);
});

// Route to save the secondary skills for an employee
router.post('/secondarySkills', (req, res) => {
const { email, skills } = req.body;

Employee.findOneAndUpdate(
{ email: email },
{ $set: { 'secondarySkills': skills } },
{ new: true, upsert: true },
(err, doc) => {
if (err) {
console.error(err);
res.status(500).send('Internal Server Error');
} else {
res.status(200).json(doc);
}
}
);
});

module.exports = router;