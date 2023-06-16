const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const EmployeeSkills = mongoose.model('Employeeskills');
const Skill = mongoose.model('Skill');






// router.get('/primaryskill', async (req, res) => {
//   try {

//     const { email } = req.body;
//     const primarySkills = await EmployeeSkills.findOne({ email });
//     res.status(200).json(primarySkills);
//   } catch (error) {
//     console.error('Error fetching primary skills:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


router.get('/primaryskill', async (req, res) => {
  try {
    const { email } = req.body;

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


router.post('/primaryskill', async (req, res) => {
    try {
      const { email, primarySkill } = req.body;
     
      const employeeSkills = await EmployeeSkills.findOne({ email });
  
      if (employeeSkills) {
        const skill = await Skill.findById(primarySkill.skillId)
      
        if (skill) {
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
        const newEmployeeSkills = new EmployeeSkills({
          email,
          primarySkill: {
            skillId: primarySkill.skillId,
            yearsOfExperience: primarySkill.yearsOfExperience,
            certification: primarySkill.certification,
          },
          secondarySkill: [],
        });
        await newEmployeeSkills.save();
        res.json({ message: 'Primary skill saved successfully.' });
      }
    } catch (error) {
      console.error('Error saving primary skill:', error);
      res.status(500).json({ error: 'Failed to save primary skill.' });
    }
  });



  router.put('/primaryskill/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { email, primarySkill } = req.body;
  
     // const employeeSkills = await EmployeeSkills.findById(id);
     const employeeSkills = await EmployeeSkills.findOne({ email });
      if (employeeSkills) {
        const skill = await Skill.findById(primarySkill.skillId);
  
        if (skill) {
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

  router.delete('/primaryskill/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email} = req.body;

    const employeeSkills = await EmployeeSkills.findOne({ email });
    if (employeeSkills) {
      const skill = await Skill.findByIdAndDelete(primarySkill.skillId);
      if (skill) {
        res.status(200).json({ message: 'Primary skill deleted successfully.' });
      } else {
        res.status(404).json({ error: 'Skill not found.' });
      }
    } else {
      res.status(404).json({ error: 'Employee skills not found.' });
    }
  } catch (error) {
    console.error('Error deleting primary skill:', error);
    res.status(500).json({ error: 'Failed to delete primary skill.' });
  }
});

/////secondary skill routes

//save route


router.post('/secondaryskill', async (req, res) => {
  try {
    const { email, secondarySkills } = req.body;

    // Validate the request body
    if (!email || !Array.isArray(secondarySkills) || secondarySkills.length === 0) {
      return res.status(400).json({ error: 'Invalid request body.' });
    }

    const employeeSkills = await EmployeeSkills.findOne({ email });

    if (employeeSkills) {
      const transformedSkills = secondarySkills.map(skill => ({
        skillId: skill.skillId,
        yearsOfExperience: parseInt(skill.yearsOfExperience),
        certification: Boolean(skill.certification)
      }));

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

//update seondary skills

router.put('/secondaryskill/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSecondarySkill = req.body;

    // Validate the request body
    if (!updatedSecondarySkill || !updatedSecondarySkill.skillId) {
      return res.status(400).json({ error: 'Invalid request body.' });
    }

    const employeeSkills = await EmployeeSkills.findOne({ 'secondarySkills._id': id });

    if (employeeSkills) {
      const secondarySkillIndex = employeeSkills.secondarySkills.findIndex(skill => skill._id.toString() === id);

      if (secondarySkillIndex === -1) {
        return res.status(404).json({ error: 'Secondary skill not found.' });
      }

      employeeSkills.secondarySkills[secondarySkillIndex] = {
        _id: employeeSkills.secondarySkills[secondarySkillIndex]._id,
        skillId: updatedSecondarySkill.skillId,
        yearsOfExperience: updatedSecondarySkill.yearsOfExperience,
        certification: updatedSecondarySkill.certification
      };

      await employeeSkills.save();

      res.json({ message: 'Secondary skill updated successfully.' });
    } else {
      res.status(404).json({ error: 'Employee skills not found.' });
    }
  } catch (error) {
    console.error('Error updating secondary skill:', error);
    res.status(500).json({ error: 'Failed to update secondary skill.' });
  }
});

//secondary delete

router.delete('/secondaryskill/:id', async (req, res) => {
  
  try {
    const { id } = req.params;
    const {email} = req.body;
  
    const employeeSkills = await EmployeeSkills.findOne({ email });
  
    if (employeeSkills) {
          const skill = await EmployeeSkills.findByIdAndDelete(id);
    if (!skill) {
       return res.status(404).json({ message: 'Skill not found' });
      }
     res.json({ message: 'Skill deleted' });
    }
  } catch (err) {
  res.status(400).json({ error: err.message });
  }
  });




  
  module.exports = router;