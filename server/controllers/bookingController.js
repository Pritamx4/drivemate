import Booking from '../models/Booking.js';

// @desc    Create new booking
// @route   POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const createdBooking = await booking.save();

    // Return success and the owner whatsapp number from env
    res.status(201).json({
      message: 'Booking saved',
      booking: createdBooking,
      ownerWhatsApp: process.env.OWNER_WHATSAPP
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
