const express = require('express');
const {
  registrationUser,
  loginUser,
  logout,
  current,
} = require('../controllers/usersControllers');
const { validateBody, isValidToken } = require('../helpers');
const userSchema = require('../schemas/usersSchema');

const usersRouter = express.Router();

usersRouter.post('/registration', validateBody(userSchema), registrationUser);
usersRouter.post('/login', validateBody(userSchema), loginUser);
usersRouter.post('/logout', isValidToken, logout);
usersRouter.get('/current', isValidToken, current);

module.exports = usersRouter;
