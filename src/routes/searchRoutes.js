// routes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Employeeskills = mongoose.model('Employeeskills');
const Skill = mongoose.model('Skill');
const User = mongoose.model('User');

router.get('/search', async (req, res) => {
  const { skillName, primarySkill, secondarySkill } = req.query;

  try {
    let query = {};

    if (skillName) {
      const skill = await Skill.findOne({ name: skillName });
      if (!skill) {
        return res.status(404).json({ error: 'Skill not found' });
      }

      const skillId = skill._id;

      if (primarySkill && !secondarySkill) {
        query = {
          'primarySkill.skillId': skillId,
        };
      } else if (!primarySkill && secondarySkill) {
        query = {
          'secondarySkills.skillId': skillId,
        };
      } else if (primarySkill && secondarySkill) {
        query = {
          $or: [
            {
              'primarySkill.skillId': skillId,
            },
            {
              $and: [
                {
                  'secondarySkills.skillId': skillId,
                },
                {
                  'secondarySkills.skillId': { $ne: null },
                },
              ],
            },
          ],
        };
      }
    }

    const employees = await Employeeskills.find(query)
      .populate({
        path: 'primarySkill.skillId',
        match: { name: skillName },
      })
      .populate({
        path: 'secondarySkills.skillId',
        match: { name: skillName },
      })
      .select('email user primarySkill secondarySkills mobileno employeelevel Name');

    const filteredEmployees = employees.map((employee) => {
      const filteredPrimarySkill = employee.primarySkill.skillId
        ? employee.primarySkill
        : null;

      const filteredSecondarySkills = employee.secondarySkills.filter(
        (secondarySkill) => {
          return (
            secondarySkill.skillId &&
            secondarySkill.skillId.name === skillName
          );
        }
      );

      return {
        email: employee.email,
        primarySkill: filteredPrimarySkill,
        secondarySkills: filteredSecondarySkills,
        mobileno: employee.mobileno,
        employeelevel: employee.employeelevel,
        Name: employee.Name
      };
    });

    res.json({ employees: filteredEmployees });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

  
  
  
  module.exports = router;