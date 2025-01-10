const express = require('express');
const { Slot } = require('../../db/models');
const { verifyAccessToken } = require('../middlewares/verifyTokens');
const slotRouter = express.Router();

slotRouter
  .route('/')
  .get(async (req, res) => {
    try {
      const slots = await Slot.findAll({ order: [['id', 'DESC']] });
      res.json(slots);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера' });
      console.log(error);
    }
  })
  .post(verifyAccessToken, async (req, res) => {
    const { title, start, end } = req.body;
    const { id } = res.locals.user;
    try {
      const newSlot = await Slot.create({ title, start, end, adminId: id });
      res.status(201).json(newSlot);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера' });
      console.log(error);
    }
  })
  .delete(verifyAccessToken, async (req, res) => {
    const { id } = req.body;
    try {
      await Slot.destroy({ where: { id } });
      res.status(200).json({ message: 'Слот удален' });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера' });
      console.log(error);
    }
  })
  .put(verifyAccessToken, async (req, res) => {
    const { id, title, start, end } = req.body;
    try {
      await Slot.update({ title, start, end }, { where: { id } });
      res.status(200).json({ message: 'Слот изменен' });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера' });
      console.log(error);
    }
  });

slotRouter
  .route('/:id')
  .get(async (req, res) => {
    const { id } = req.params;
    try {
      const slot = await Slot.findOne({ where: { id } });
      res.json(slot);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера' });
      console.log(error);
    }
  })
  .put(verifyAccessToken, async (req, res) => {
    const { id } = req.params;
    const { title, start, end } = req.body;
    try {
      await Slot.update({ title, start, end }, { where: { id } });
      res.status(200).json({ message: 'Слот изменен' });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера' });
      console.log(error);
    }
  });

module.exports = slotRouter;
