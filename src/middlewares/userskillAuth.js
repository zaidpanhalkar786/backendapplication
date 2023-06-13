const mongoose = require('mongoose');
const Userskill = mongoose.model('Userskill');

module.exports = {
checkDuplicateSkill: async (req, res, next) => {
const { skillName } = req.body;

const existingEmployee = await Employee.findOne({
$or: [
{ 'primarySkill.skillName': skillName },
{ 'secondarySkills.skillName': skillName },
],
});

if (existingEmployee) {
return res.status(400).json({ error: 'Skill already exists' });
}

next();
},
};