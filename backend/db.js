// backend/db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;

const client = new MongoClient(uri); // ✅ no extra options needed in v5+

let db;

async function connectDB() {
  try {
    if (!db) {
      await client.connect();
      db = client.db(dbName);
      console.log("✅ MongoDB connected successfully");
    }
    return db;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
