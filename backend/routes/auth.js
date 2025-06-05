const verifyToken = require("../middleware/verifyToken");
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const connectDB = require("../db");
const { MongoClient, ObjectId } = require('mongodb');
const generateAccessCode = require('../utils/generateCode');
const {sendAccessCode,sendMilestoneEmail} = require('../utils/mailer');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = 'streamline';
const jwtSecret = process.env.JWT_SECRET;

// --------------------------
// LOGIN
// --------------------------
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

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '2h' });
    const refreshToken = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

    return res.status(200).json({
      message: 'Login successful',
      token,
      refreshToken,
      user: payload,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// --------------------------
// RESERVE ACCESS
// --------------------------
router.post('/reserve-access', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }

  const code = generateAccessCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  try {
    await client.connect();
    const db = client.db(dbName);

    await db.collection('access_codes').deleteMany({ email });

    await db.collection('access_codes').insertOne({
      email,
      code,
      expiresAt,
      createdAt: new Date(),
    });

    await sendAccessCode(email, code);

    return res.status(200).json({ message: 'Access code sent to email.' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to send access code.' });
  }
});

// --------------------------
// VERIFY ACCESS CODE
// --------------------------
router.post('/verify-access-code', async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: 'Email and code are required.' });
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const record = await db.collection('access_codes').findOne({ email });

    if (!record) {
      return res.status(404).json({ message: 'No access code found for this email.' });
    }

    if (record.code !== code) {
      return res.status(401).json({ message: 'Incorrect code.' });
    }

    const now = new Date();
    if (record.expiresAt < now) {
      await db.collection('access_codes').deleteOne({ email });
      return res.status(410).json({ message: 'Code has expired. Please request a new one.' });
    }

    return res.status(200).json({ message: 'Code verified. Proceed to signup.' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error verifying code.' });
  }
});

// --------------------------
// SIGNUP
// --------------------------
router.post('/signup', async (req, res) => {
  const {
    email,
    firstName,
    middleName,
    lastName,
    password,
    phoneNumber,
    referralId
  } = req.body;

  if (!email || !firstName || !lastName || !password || !phoneNumber) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection('users');

    const existing = await users.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      email,
      firstName,
      middleName,
      lastName,
      passwordHash,
      phoneNumber,
      referralCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Handle Referrals
    if (referralId) {
      const referrals = db.collection('referrals');

      await referrals.insertOne({
        referrerId: referralId,
        refereeEmail: email,
        status: 'registered',
        createdAt: new Date(),
      });

      await users.updateOne(
        { _id: new ObjectId(referralId) },
        { $inc: { referralCount: 1 } }
      );

      const referrer = await users.findOne({ _id: new ObjectId(referralId) });

  const newPoints = Math.floor(referrer.referralCount / 5) - (referrer.points || 0);
  if (newPoints > 0) {
    await users.updateOne(
      { _id: new ObjectId(referralId) },
      { $inc: { points: newPoints } }
    );

    // Send Email (pseudocode, you already have nodemailer)
    sendMilestoneEmail(referrer.email, referrer.referralCount);
      }
    }

    await db.collection('access_codes').deleteOne({ email });

    const payload = {
      id: result.insertedId.toString(),
      email,
      firstName,
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '2h' });
    const refreshToken = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

    return res.status(200).json({
      message: 'Signup successful',
      token,
      refreshToken,
      user: payload,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Signup failed. Try again.' });
  }
});

// --------------------------
// REFRESH TOKEN
// --------------------------
router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token missing.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, jwtSecret);
    const payload = {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
    };

    const newToken = jwt.sign(payload, jwtSecret, { expiresIn: '2h' });

    return res.status(200).json({ token: newToken });

  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid or expired refresh token.' });
  }
});

// ✅ Get user referral stats (points, referral count)
router.get("/user/me", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne(
      { _id: new ObjectId(req.user.id) },
      { projection: { referralCount: 1, points: 1 } }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error in /user/me:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
