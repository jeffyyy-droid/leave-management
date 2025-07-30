// backend/controllers/authController.js
const User = require('../models/User');
const jwt  = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { fullName, email, role } = req.body;
    if (!fullName || !email || !role) {
      return res.status(400).json({ message: 'Full name, email, and role are required' });
    }

    // Prevent duplicate by lowercase email index
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const user = new User({
      "Full Name": fullName,
      "Email":     email,  // your quoted field
      email,               // lowercase field for legacy index
      role
    });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Login attempt with email:", email);
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ "Email": email });
    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    console.log("Generated token:", token);

    res.json({ token, user });    
    console.log("User found:", user);
    console.log("Generated token:", token);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

