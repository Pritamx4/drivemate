import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Admin from '../models/Admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not set in environment variables');
    }

    await mongoose.connect(process.env.MONGO_URI);

    const adminUsername = process.env.ADMIN_SEED_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'password123';

    const existingAdmin = await Admin.findOne({ username: adminUsername });
    if (existingAdmin) {
      existingAdmin.password = adminPassword;
      await existingAdmin.save();
      console.log(`Admin "${adminUsername}" already exists - password updated successfully.`);
    } else {
      const admin = new Admin({
        username: adminUsername,
        password: adminPassword,
      });
      await admin.save();
      console.log(`Admin "${adminUsername}" created successfully!`);
    }

    console.log(`Username: ${adminUsername}`);
    console.log(`Password: ${adminPassword}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
