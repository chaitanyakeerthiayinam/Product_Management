const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Register a new user (for testing, you can use this to add users)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  //const { username, password, role } = req.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  //const user = new User({ username, password, role });
  const user = new User({ username, email, password, role });

  try {
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error creating user' });
  }
});

// Get All Users
router.get('/', protect, async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// Get User by ID
router.get('/:id', protect, async (req, res) => {
  const users= await User.findById(req.params.id);
  if (users) {
    res.json(users);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});


// Login a user and get a JWT token
router.post('/login', async (req, res) => {
  const { username, email, password, role} = req.body;
  //const { username, password, role} = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '30d' }); // Replace 'your_jwt_secret' with a secret key
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Get the logged-in user's profile (example protected route)
router.get('/profile', protect, async (req, res) => {
  res.json({
    _id: req.user._id,
    username: req.user.username,
  });
});

module.exports = router;
