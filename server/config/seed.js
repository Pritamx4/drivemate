import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from '../models/Car.js';

dotenv.config({ path: './.env' });

const INITIAL_CARS = [
  {
    name: 'Mahindra Bolero', category: 'SUV', pricePerDay: 2300, seats: 7,
    fuelType: 'Diesel', transmission: 'Manual', image: '/cars/bolero.png',
    tagline: 'The rugged workhorse', description: 'Perfect for rural roads and group outings.',
  },
  {
    name: 'Mahindra Thar', category: 'SUV', pricePerDay: 2500, seats: 4,
    fuelType: 'Diesel', transmission: 'Manual', image: '/cars/thar.png',
    tagline: 'Built for adventure', description: 'Iconic 4x4 for off-road thrills.',
  },
  {
    name: 'Mahindra Scorpio N', category: 'SUV', pricePerDay: 2600, seats: 7,
    fuelType: 'Diesel', transmission: 'Auto', image: '/cars/scorpio_n.png',
    tagline: 'The king of roads', description: 'Bold styling and excellent performance.',
  },
  {
    name: 'Hyundai i20', category: 'Hatchback', pricePerDay: 1500, seats: 5,
    fuelType: 'Petrol', transmission: 'Manual', image: '/cars/i20.png',
    tagline: 'The premium hatchback', description: 'Smooth, stylish, and perfect for city driving.',
  },
  {
    name: 'Maruti Swift', category: 'Hatchback', pricePerDay: 1300, seats: 5,
    fuelType: 'Petrol', transmission: 'Manual', image: '/cars/swift.png',
    tagline: 'The urban legend', description: 'Highly fuel efficient and remarkably agile.',
  },
  {
    name: 'Mercedes Benz C-Class', category: 'Sedan', pricePerDay: 8500, seats: 5,
    fuelType: 'Petrol', transmission: 'Auto', image: '/cars/mercedes.png',
    tagline: 'Luxury defined', description: 'Experience the pinnacle of comfort and class.',
  },
  {
    name: 'Audi Q7', category: 'SUV', pricePerDay: 9000, seats: 7,
    fuelType: 'Diesel', transmission: 'Auto', image: '/cars/audi_q7.png',
    tagline: 'Uncompromised luxury', description: 'The ultimate luxury SUV for VIP travel.',
  },
  {
    name: 'Porsche 911', category: 'Sports', pricePerDay: 15000, seats: 2,
    fuelType: 'Petrol', transmission: 'Auto', image: '/cars/porsche_911.png',
    tagline: 'Pure performance', description: 'Unmatched speed and handling on every curve.',
  },
  {
    name: 'Tesla Model 3', category: 'Sedan', pricePerDay: 4500, seats: 5,
    fuelType: 'Electric', transmission: 'Auto', image: '/cars/tesla.png',
    tagline: 'The future of driving', description: 'Zero emissions, instant acceleration.',
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Car.deleteMany();
    await Car.insertMany(INITIAL_CARS);
    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
