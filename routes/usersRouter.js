const express = require('express');
const { upload } = require('../middlewares');
const {
  registrationUser,
  loginUser,
  logout,
  current,
  updateAvatar,
  verifyUser,
  resendMail,
} = require('../controllers/usersControllers');
const { validateBody, isValidToken } = require('../helpers');
const { userSchema, resendVerify } = require('../schemas/usersSchema');

const usersRouter = express.Router();

usersRouter.post('/registration', validateBody(userSchema), registrationUser);
usersRouter.post('/login', validateBody(userSchema), loginUser);
usersRouter.get('/verify/:verifyToken', verifyUser);
usersRouter.post('/verify', validateBody(resendVerify), resendMail);
usersRouter.post('/logout', isValidToken, logout);
usersRouter.get('/current', isValidToken, current);
usersRouter.patch(
  '/avatars',
  isValidToken,
  upload.single('avatar'),
  updateAvatar
);

module.exports = usersRouter;
