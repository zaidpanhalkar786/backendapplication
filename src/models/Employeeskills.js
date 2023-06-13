
const mongoose = require('mongoose');
const Skill = mongoose.model('Skill');
const employeeSkillsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  primarySkill: {
    skillId: {
      type: mongoose.Schema.Types.ObjectId, // Update the type to reference the Skill model's ID
      ref: 'Skill', // Reference the Skill model
      required: true,
    },
    yearsOfExperience: {
      type: String,
      required: true,
    },
    certification: {
      type: String,
    },
  },
  secondarySkills: [
    {
      skillId: {
        type: mongoose.Schema.Types.ObjectId, // Update the type to reference the Skill model's ID
        ref: 'Skill', // Reference the Skill model
        required: true,
      },
      yearsOfExperience: {
        type: String,
        required: true,
      },
      certification: {
        type: String,
      },
    },
  ],
});

 mongoose.model('Employeeskills', employeeSkillsSchema);




