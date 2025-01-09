const express = require('express');
const { Slot } = require('../../db/models');
const slotRouter = express.Router();

slotRouter.get('/', async (req, res) => {
  try {
    const slots = await Slot.findAll({ order: [['id', 'DESC']] });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
    console.log(error);
  }
});

module.exports = slotRouter;
