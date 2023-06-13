const mongoose = require('mongoose');

// Schema for the primary skill
const primarySkillSchema = new mongoose.Schema({
skillName: {
type: String,
required: true
},
yearsOfExperience: {
type: String,
required: true
},
certification: {
type: String
}
});

// Schema for the secondary skill
const secondarySkillSchema = new mongoose.Schema({
skillName: {
type: String,
required: true
},
yearsOfExperience: {
type: String,
required: true
},
certification: {
type: String
}
});

// Schema for the employee
const employeeSchema = new mongoose.Schema({
email: {
type: String,
required: true
},
primarySkill: {
type: primarySkillSchema,
required: true
},
secondarySkills: {
type: [secondarySkillSchema],
required: true
}
});

// Model for the employee
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;