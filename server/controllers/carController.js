import Car from '../models/Car.js';

// @desc    Get all cars
// @route   GET /api/cars
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({});
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a car
// @route   POST /api/cars
export const createCar = async (req, res) => {
  try {
    const car = new Car(req.body);
    const createdCar = await car.save();
    res.status(201).json(createdCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a car
// @route   PUT /api/cars/:id
export const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) {
      Object.assign(car, req.body);
      const updatedCar = await car.save();
      res.json(updatedCar);
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) {
      await car.deleteOne();
      res.json({ message: 'Car removed' });
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
