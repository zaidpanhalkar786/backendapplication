const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const EmployeeSkills = mongoose.model('Employeeskills');
const Skill = mongoose.model('Skill');

router.get('/primaryskill', async (req, res) => {
  try {
    const { email } = req.query;

    const employeeSkills = await EmployeeSkills.findOne({ email }).populate('primarySkill.skillId');

    if (!employeeSkills) {
      return res.status(404).json({ message: 'Employee skills not found' });
    }

    const { primarySkill } = employeeSkills;
    res.json(primarySkill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


//save primary skill route
router.post('/primaryskill', async (req, res) => {
  try {
    const { email, mobileno, employeelevel, Name, primarySkill } = req.body;

    const employeeSkills = await EmployeeSkills.findOne({ email });

    if (employeeSkills) {
      const skill = await Skill.findById(primarySkill.skillId);

      if (skill) {
        // Check if the skill already exists as a secondary skill
        const isSecondarySkill = employeeSkills.secondarySkills.some(
          (secondarySkill) => secondarySkill.skillId.toString() === primarySkill.skillId
        );

        if (isSecondarySkill) {
          return res.status(400).json({ error: 'Skill already added as Secondary Skill.' });
        }

        employeeSkills.primarySkill = {
          skillId: skill._id,
          yearsOfExperience: primarySkill.yearsOfExperience,
          certification: primarySkill.certification,
        };
        await employeeSkills.save();
        res.json({ message: 'Primary skill saved successfully.' });
      } else {
        res.status(404).json({ error: 'Skill not found.' });
      }
    } else {
      // Check if the skill already exists as a secondary skill
      const isSecondarySkill = await EmployeeSkills.exists({
        email,
        'secondarySkills.skillId': primarySkill.skillId,
      });

      if (isSecondarySkill) {
        return res.status(400).json({ error: 'Skill already added as Secondary Skill.' });
      }

      const newEmployeeSkills = new EmployeeSkills({
        email,
        mobileno,
        employeelevel,
        Name,
        primarySkill: {
          skillId: primarySkill.skillId,
          yearsOfExperience: primarySkill.yearsOfExperience,
          certification: primarySkill.certification,
        },
        secondarySkills: [],
      });
      await newEmployeeSkills.save();
      res.json({ message: 'Primary skill saved successfully.' });
    }
  } catch (error) {
    console.error('Error saving primary skill:', error);
    res.status(500).json({ error: 'Failed to save primary skill.' });
  }
});


//update primary skill route

router.put('/primaryskill/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, primarySkill } = req.body;

    const employeeSkills = await EmployeeSkills.findOne({ email });

    if (employeeSkills) {
      const skill = await Skill.findById(primarySkill.skillId);

      if (skill) {
        // Check if the skill already exists as a secondary skill
        const isSecondarySkill = employeeSkills.secondarySkills.some(
          (secondarySkill) => secondarySkill.skillId.toString() === primarySkill.skillId
        );

        if (isSecondarySkill) {
          return res.status(400).json({ error: 'Skill already added as Secondary Skill.' });
        }

        employeeSkills.primarySkill = {
          skillId: skill._id,
          yearsOfExperience: primarySkill.yearsOfExperience,
          certification: primarySkill.certification,
        };
        await employeeSkills.save();
        res.json({ message: 'Primary skill updated successfully.' });
      } else {
        res.status(404).json({ error: 'Skill not found.' });
      }
    } else {
      res.status(404).json({ error: 'Employee skills not found.' });
    }
  } catch (error) {
    console.error('Error updating primary skill:', error);
    res.status(500).json({ error: 'Failed to update primary skill.' });
  }
});










//save secondary skill route

router.post('/secondaryskill', async (req, res) => {
  try {
    const { email, secondarySkills } = req.body;

    // Validate the request body
    if (!email || !Array.isArray(secondarySkills) || secondarySkills.length === 0) {
      return res.status(400).json({ error: 'Invalid request body.' });
    }

    const employeeSkills = await EmployeeSkills.findOne({ email });

    if (employeeSkills) {
      const transformedSkills = secondarySkills.map((skill) => ({
        _id: new mongoose.Types.ObjectId(),
        skillId: skill.skillId,
        yearsOfExperience: skill.yearsOfExperience,
        certification: skill.certification,
      }));

      // Check if the skill already exists as a primary skill
      const isPrimarySkill = employeeSkills.primarySkill && employeeSkills.primarySkill.skillId.toString() === transformedSkills[0].skillId;
      if (isPrimarySkill) {
        return res.status(400).json({ error: 'Skill already added as Primary Skill.' });
      }

      employeeSkills.secondarySkills.push(...transformedSkills);
      await employeeSkills.save();

      res.json({ message: 'Secondary skills saved successfully.' });
    } else {
      res.status(404).json({ error: 'Employee skills not found.' });
    }
  } catch (error) {
    console.error('Error saving secondary skills:', error);
    res.status(500).json({ error: 'Failed to save secondary skills.' });
  }
});


//update seondary skills route

router.put('/secondaryskill/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, updatedSecondarySkill } = req.body;

    // Validate the request body
    if (!updatedSecondarySkill || !updatedSecondarySkill.skillId) {
      return res.status(400).json({ error: 'Invalid request body.' });
    }

    const employeeSkill = await EmployeeSkills.findOne({ email });
    if (!employeeSkill) {
      return res.status(404).json({ error: 'Employee skills not found.' });
    }

    const secondarySkillIndex = employeeSkill.secondarySkills.findIndex(
      (skill) => skill.skillId.toString() === id
    );

    if (secondarySkillIndex === -1) {
      return res.status(404).json({ error: 'Secondary skill not found.' });
    }

    // Check if the updated skill already exists as a primary skill
    const isPrimarySkill = employeeSkill.primarySkill && employeeSkill.primarySkill.skillId.toString() === updatedSecondarySkill.skillId;
    if (isPrimarySkill) {
      return res.status(400).json({ error: 'Skill already added as Primary Skill.' });
    }

    employeeSkill.secondarySkills[secondarySkillIndex] = {
      _id: id,
      skillId: updatedSecondarySkill.skillId,
      yearsOfExperience: updatedSecondarySkill.yearsOfExperience,
      certification: updatedSecondarySkill.certification,
    };

    await employeeSkill.save();

    res.json({ message: 'Secondary skill updated successfully.' });
  } catch (error) {
    console.error('Error updating secondary skill:', error);
    res.status(500).json({ error: 'Failed to update secondary skill.' });
  }
});



router.put('/secondaryskillupdatetable', async (req, res) => {
  try {
    const { email, secondarySkills } = req.body;

    // Validate the request body
    if (!Array.isArray(secondarySkills)) {
      return res.status(400).json({ error: 'Invalid request body.' });
    }

    const employeeSkill = await EmployeeSkills.findOne({ email });
    if (!employeeSkill) {
      return res.status(404).json({ error: 'Employee skills not found.' });
    }

    employeeSkill.secondarySkills = secondarySkills;

    await employeeSkill.save();

    res.json({ message: 'Secondary skills updated successfully.' });
  } catch (error) {
    console.error('Error updating secondary skills:', error);
    res.status(500).json({ error: 'Failed to update secondary skills.' });
  }
});

router.get('/secondaryskills', async (req, res) => {
  try {
    const { email } = req.query;

    const employeeSkills = await EmployeeSkills.findOne({ email }).populate('secondarySkills.skillId');

    if (!employeeSkills) {
      return res.status(404).json({ message: 'Employee skills not found' });
    }

    const { secondarySkills } = employeeSkills;
    res.json(secondarySkills);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

  
  module.exports = router;