const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    console.log('User created successfully');
    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('Error during registration:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});


router.post('/login', async(req, res) => {
    const { email, password } = req.body
    try{
        const user = await User.findOne({ email })
        if(!user) return res.status(400).json({ error: 'Invalid credentials'})
        
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({ error: 'Invalid credentials'})

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET,
            { expiresIn: '1h'})
        res.json({ token })
    } catch (err) {
        res.sendStatus(500).json({ error: 'Server error '})
    }
})

module.exports = router