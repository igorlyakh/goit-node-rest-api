const HttpError = require('./HttpError');
const jwt = require('jsonwebtoken');
const User = require('../models');

const isValidToken = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [type, token] = authorization.split(' ');
  if (type !== 'Bearer') {
    next(HttpError(401));
  }
  if (!token) {
    next(HttpError(401));
  }
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = User.findById(id);
    req.user = user;
  } catch {
    next(HttpError(401));
  }
};

module.exports = isValidToken;
