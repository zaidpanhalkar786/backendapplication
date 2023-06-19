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
      const { email,mobileno,employeelevel,Name,primarySkill } = req.body;
     
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
          mobileno,
          employeelevel,
          Name,
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
        _id: new mongoose.Types.ObjectId(),
        skillId: skill.skillId,
        yearsOfExperience: skill.yearsOfExperience,
        certification: skill.certification
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

//update seondary skills route

// router.put('/secondaryskill/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {email,updatedSecondarySkill} = req.body;

//     // Validate the request body
//     if (!updatedSecondarySkill || !updatedSecondarySkill.skillId) {
//       return res.status(400).json({ error: 'Invalid request body.' });
//     }
//     const employeeSkill = await EmployeeSkills.findOne({ email });
//     if(employeeSkill) {
//     const employeeSkills = await EmployeeSkills.findOne({ 'secondarySkills._id': id });

//     if (employeeSkills) {
//       const secondarySkillIndex = employeeSkills.secondarySkills.findIndex(skill => skill._id.toString() === id);

//       if (secondarySkillIndex === -1) {
//         return res.status(404).json({ error: 'Secondary skill not found.' });
//       }

//       employeeSkills.secondarySkills[secondarySkillIndex] = {
//         _id: employeeSkills.secondarySkills[secondarySkillIndex]._id,
//         skillId: updatedSecondarySkill.skillId,
//         yearsOfExperience: updatedSecondarySkill.yearsOfExperience,
//         certification: updatedSecondarySkill.certification
//       };

//       await employeeSkills.save();

//       res.json({ message: 'Secondary skill updated successfully.' });
//     } else {
//       res.status(404).json({ error: 'Employee skills not found.' });
//     }
//   }
//   } catch (error) {
//     console.error('Error updating secondary skill:', error);
//     res.status(500).json({ error: 'Failed to update secondary skill.' });
//   }
// });

// //secondary delete

// router.delete('/secondaryskill/:id', async (req, res) => {
  
//   try {
//     const { id } = req.params;
//     const {email} = req.body;
  
//     const employeeSkills = await EmployeeSkills.findOne({ email });
  
//     if (employeeSkills) {
//           const skill = await EmployeeSkills.findByIdAndDelete(id);
//     if (!skill) {
//        return res.status(404).json({ message: 'Skill not found' });
//       }
//      res.json({ message: 'Skill deleted' });
//     }
//   } catch (err) {
//   res.status(400).json({ error: err.message });
//   }
//   });
// router.put('/secondaryskill/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { email, updatedSecondarySkill } = req.body;

//     // Validate the request body
//     if (!updatedSecondarySkill || !updatedSecondarySkill.skillId) {
//       return res.status(400).json({ error: 'Invalid request body.' });
//     }

//     const employeeSkill = await EmployeeSkills.findOne({ email });
//     if (!employeeSkill) {
//       return res.status(404).json({ error: 'Employee skills not found.' });
//     }

//     const secondarySkillIndex = employeeSkill.secondarySkills.findIndex(
//       (skill) => skill._id.toString() === id
//     );

//     if (secondarySkillIndex === -1) {
//       return res.status(404).json({ error: 'Secondary skill not found.' });
//     }

//     employeeSkill.secondarySkills[secondarySkillIndex] = {
//       skillId: updatedSecondarySkill.skillId,
//       yearsOfExperience: updatedSecondarySkill.yearsOfExperience,
//       certification: updatedSecondarySkill.certification,
//     };

//     await employeeSkill.save();

//     res.json({ message: 'Secondary skill updated successfully.' });
//   } catch (error) {
//     console.error('Error updating secondary skill:', error);
//     res.status(500).json({ error: 'Failed to update secondary skill.' });
//   }
// });
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


  
  module.exports = router;