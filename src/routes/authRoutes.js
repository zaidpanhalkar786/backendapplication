

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async (req, res) => {
  
    const { email, password,firstname,lastname,mobileno,employeelevel} = req.body;

  try {
    const user = new User({ email, password, firstname, lastname, mobileno,employeelevel});
    await user.save();

    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    res.send({ token });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: 'Must provide email and password' });
  }
  try{

  const user = await User.findOne({email});
  if (!user) {
    return res.status(422).send({ error: 'Invalid password or email' });
  }
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(422).send({ error: 'Invalid password or email' });
    }
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    

    const firstname = user.firstname
    const lastname = user.lastname
    const mobileno = user.mobileno
    const employeelevel = user.employeelevel
    const status = user.status
    const role =  user.role // retrive the role from user object
    res.send({token, role, status,email,mobileno,employeelevel,firstname,lastname}); //Include role in the response

  } catch (err) {
    return res.status(422).send({ error: 'Invalid password or email' });
  }
});

module.exports = router;