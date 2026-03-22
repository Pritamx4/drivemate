import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      username: admin.username,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
};

// @desc    Seed Initial Admin (Experimental/One-time)
// @route   POST /api/auth/seed
export const seedAdmin = async (req, res) => {
  const { username, password, secret } = req.body;
  
  // Basic guard for seeding
  if (secret !== 'drivemate_setup_2026') return res.status(403).json({ message: 'Forbidden' });

  const adminExists = await Admin.findOne({ username });
  if (adminExists) return res.status(400).json({ message: 'Admin already exists' });

  const admin = await Admin.create({ username, password });
  if (admin) {
    res.status(201).json({ message: 'Admin created successfully' });
  } else {
    res.status(400).json({ message: 'Invalid admin data' });
  }
};
