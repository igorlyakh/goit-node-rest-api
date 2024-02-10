const express = require('express');
const { upload } = require('../middlewares');
const {
  registrationUser,
  loginUser,
  logout,
  current,
  updateAvatar,
} = require('../controllers/usersControllers');
const { validateBody, isValidToken } = require('../helpers');
const userSchema = require('../schemas/usersSchema');

const usersRouter = express.Router();

usersRouter.post('/registration', validateBody(userSchema), registrationUser);
usersRouter.post('/login', validateBody(userSchema), loginUser);
usersRouter.post('/logout', isValidToken, logout);
usersRouter.get('/current', isValidToken, current);
usersRouter.patch(
  '/avatars',
  isValidToken,
  upload.single('avatar'),
  updateAvatar
);

module.exports = usersRouter;
