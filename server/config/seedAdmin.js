import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config({ path: './.env' });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminUsername = process.env.ADMIN_SEED_USERNAME;
    const adminPassword = process.env.ADMIN_SEED_PASSWORD;

    if (!adminUsername || !adminPassword) {
      throw new Error('ADMIN_SEED_USERNAME and ADMIN_SEED_PASSWORD must be set in .env');
    }
    
    const adminExists = await Admin.findOne({ username: adminUsername });
    if (adminExists) {
      console.log('Admin already exists!');
      process.exit();
    }

    const admin = new Admin({
      username: adminUsername,
      password: adminPassword // This will be hashed by the model middleware
    });

    await admin.save();
    console.log('Admin Created Successfully!');
    console.log(`Username: ${adminUsername}`);
    console.log('Password: [set via .env]');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
