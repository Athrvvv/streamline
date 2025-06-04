// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = 'streamline';
const jwtSecret = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    const payload = {
  id: user._id.toString(),
  email: user.email,
  firstName: user.firstName,
};


    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: rememberMe ? '30d' : '2h',
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: payload,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
