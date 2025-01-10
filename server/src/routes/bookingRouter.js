const express = require('express');
const { Booking } = require('../../db/models');
const { verifyAccessToken } = require('../middlewares/verifyTokens');
const bookingRouter = express.Router();

bookingRouter
  .get('/', async (req, res) => {
    try {
      const bookings = await Booking.findAll({ order: [['id', 'DESC']] });
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера' });
      console.log(error);
    }
  })
  .post('/', verifyAccessToken, async (req, res) => {
    try {
      const { id } = res.locals.user;
      const { duration } = req.body;
      const newBooking = await Booking.create({ duration, userId: id });
      res.status(201).json(newBooking);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера' });
      console.log(error);
    }
  });

module.exports = bookingRouter;
