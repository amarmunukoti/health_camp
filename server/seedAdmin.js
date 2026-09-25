const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('[SeedAdmin] Demo admin account "admin" already exists in MongoDB.');
    } else {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        username: 'admin',
        password: hashedPassword,
      });
      console.log('[SeedAdmin] Demo admin account created successfully: admin / admin123 (hashed with bcrypt)');
    }
  } catch (error) {
    console.error('[SeedAdmin] Error seeding admin:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('[SeedAdmin] Database connection closed.');
    process.exit(0);
  }
};

seedAdmin();
