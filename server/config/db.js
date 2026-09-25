const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/health_camp_db';

  try {
    // Attempt connecting to configured MongoDB
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout for fallback
    });
    console.log(`[MongoDB] Connected successfully to standard MongoDB: ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB] Standard MongoDB connection failed (${error.message}). Starting in-memory MongoDB fallback...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`[MongoDB] Connected successfully to In-Memory MongoDB at: ${inMemoryUri}`);
    } catch (memErr) {
      console.error(`[MongoDB] In-Memory MongoDB start error: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
