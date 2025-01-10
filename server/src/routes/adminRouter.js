const express = require('express');
const { AdminUser } = require('../../db/models');
const adminRouter = express.Router();

adminRouter.get('/', async (req, res) => {
  try {
    const admins = await AdminUser.findOne();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
    console.log(error);
  }
});

module.exports = adminRouter;