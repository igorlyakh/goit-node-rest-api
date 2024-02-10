const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const jimp = require('jimp');
const path = require('path');
const fs = require('fs/promises');
const { User } = require('../models');
const { HttpError } = require('../helpers');
const { JWT_SECRET } = process.env;

const publicPath = path.join(__dirname, '../', 'public', 'avatars');

const registrationUser = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const result = await User.create({
      ...req.body,
      password: hashedPassword,
      avatarURL,
    });
    res.status(201).json({
      id: result._id,
      subscription: result.subscription,
      email,
      avatarURL,
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
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '30d',
    });
    await User.findByIdAndUpdate(user._id, { token });
    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { path: tmpPath, originalname } = req.file;
  const resultPath = path.join(publicPath, `${_id}_${originalname}`);
  const avatarURL = path.join('avatars', `${_id}_${originalname}`);
  try {
    jimp
      .read(tmpPath)
      .then(img => {
        fs.unlink(tmpPath);
        return img.resize(250, 250).write(resultPath);
      })
      .catch(error => console.log(error));
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registrationUser,
  loginUser,
  logout,
  current,
  updateAvatar,
};
