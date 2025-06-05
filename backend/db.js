// backend/db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;             // From your .env file
const dbName = process.env.MONGO_DB_NAME;      // Add this too in your .env

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected successfully");

    const db = client.db(dbName);
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

module.exports = connectDB;
