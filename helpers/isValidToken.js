const HttpError = require('./HttpError');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { JWT_SECRET } = process.env;

const isValidToken = async (req, res, next) => {
  const authorization = req.headers.authorization || '';
  const [type, token] = authorization.split(' ');
  if (type !== 'Bearer') {
    next(HttpError(401));
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || token !== user.token || !user.token) {
      next(HttpError(401));
    }
    req.user = user;
    next();
  } catch {
    next(HttpError(401));
  }
};

module.exports = isValidToken;
