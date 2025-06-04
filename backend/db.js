// backend/db.js
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://Streamline-user:Streamline-user@cluster0.t6xmbcg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected successfully");

    const db = client.db('streamline'); // You can customize this DB name
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

module.exports = connectDB;
