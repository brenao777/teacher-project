const express = require('express');
const bcrypt = require('bcrypt');
const newPasswordRouter = express.Router();
const User = require('../../db/models/user');

newPasswordRouter.post('/reset-password', async (req, res) => {
  const { email, resetCode, newPassword } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || user.resetCode !== resetCode) {
    return res.status(400).send('Неверный код восстановления');
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetCode = null;
  await user.save();

  res.send('Пароль успешно обновлён');
});

module.exports = newPasswordRouter;
