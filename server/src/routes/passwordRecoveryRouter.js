const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { User } = require('../../db/models');
const passwordRecoveryRouter = express.Router();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

passwordRecoveryRouter.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).send('Пользователь не найден');

  const resetCode = crypto.randomBytes(3).toString('hex');
  user.resetCode = resetCode;
  await user.save();

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: user.email,
    subject: 'Восстановление пароля',
    text: `Ваш код восстановления: ${resetCode}`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) return res.status(500).send('Ошибка отправки письма');
    res.send('Код восстановления отправлен на вашу почту');
  });
});

module.exports = passwordRecoveryRouter;
