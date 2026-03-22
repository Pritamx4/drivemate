import express from 'express';
import { getCars, createCar, updateCar, deleteCar } from '../controllers/carController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCars)
  .post(protect, createCar);

router.route('/:id')
  .put(protect, updateCar)
  .delete(protect, deleteCar);

export default router;
