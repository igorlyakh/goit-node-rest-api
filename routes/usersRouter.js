const express = require('express');
const {
  registrationUser,
  loginUser,
} = require('../controllers/usersControllers');
const { validateBody } = require('../helpers');
const userSchema = require('../schemas/usersSchema');

const usersRouter = express.Router();

usersRouter.post('/registration', validateBody(userSchema), registrationUser);
usersRouter.post('/login', validateBody(userSchema), loginUser);

module.exports = usersRouter;
