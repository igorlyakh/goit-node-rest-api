const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { HttpError } = require('../helpers');

const registrationUser = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.create({ ...req.body, password: hashedPassword });
    res.status(201).json({
      id: result._id,
      subscription: result.subscription,
      email,
    });
  } catch (error) {
    if (error.code === 11000) {
      next(HttpError(409, 'Email in use'));
    }
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, 'Wrong email or password.');
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw HttpError(401, 'Wrong email or password.');
    }
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registrationUser,
  loginUser,
};
