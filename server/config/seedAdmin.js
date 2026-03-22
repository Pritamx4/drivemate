import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config({ path: './.env' });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('Admin already exists!');
      process.exit();
    }

    const admin = new Admin({
      username: 'admin',
      password: 'password123' // This will be hashed by the model middleware
    });

    await admin.save();
    console.log('Admin Created Successfully!');
    console.log('Username: admin');
    console.log('Password: password123');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
