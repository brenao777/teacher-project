const express = require('express');
const { Booking } = require('../../db/models');
const bookingRouter = express.Router();

bookingRouter.get('/', async (req, res) => {
  try {
    const bookings = await Booking.findAll({ order: [['id', 'DESC']] });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
    console.log(error);
  }
});

module.exports = bookingRouter;