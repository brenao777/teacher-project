const express = require('express');
const bcrypt = require('bcrypt');
const {User} = require('../../db/models/');


const { verifyRefreshToken } = require('../middlewares/verifyTokens');

const passwordRouter = express.Router();

passwordRouter.post('/', verifyRefreshToken, async (req, res) => {
  console.log(res.locals);

  const { password } = req.body;
  const userId = res.locals.user.id;
  try {
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Пароль должен содержать не менее 6 символов' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.update({ password: hashedPassword }, { where: { id: userId } });
    res.json({ message: 'Пароль успешно изменён' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = passwordRouter;
