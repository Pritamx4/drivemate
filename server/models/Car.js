import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // Luxury, SUV, etc.
  transmission: { type: String, default: 'Automatic' },
  fuelType: { type: String, default: 'Petrol' },
  seats: { type: Number, default: 5 },
  pricePerDay: { type: Number, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 5 },
  isAvailable: { type: Boolean, default: true },
  tagline: { type: String },
  description: { type: String },
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);
export default Car;
