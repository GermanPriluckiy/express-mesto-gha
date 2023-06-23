const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');

const {
  ERROR_CODE,
  DEFAULT_ERROR_CODE,
} = require('../utils/utils');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Что-то пошло не так' }));
};

const getUserById = (req, res, next) => User.findById(req.params.userId)
  .orFail(() => { throw new NotFoundError('Нет пользователя с таким id'); })
  .then((user) => res.send(user))
  .catch(next);

// const getUserById = (req, res, next) => User.findById(req.params.userId)
//   .orFail(() => new Error('Not found'))
//   .then((user) => res.send(user))
//   .catch((err) => {
//     if (err.message === 'Not found') {
//       res
//         .status(NOT_FOUND_ERROR_CODE)
//         .send({ message: 'Пользователь не найден' });
//     } else if (err.name === 'CastError') {
//       res.status(ERROR_CODE).send({ message: 'Введены некорректные данные' });
//     } else {
//       res.status(DEFAULT_ERROR_CODE).send({ message: 'Что-то пошло не так' });
//     }
//   });

const createUser = (req, res) => {
  bcrypt.hash(String(req.body.password), 10).then((hashedPass) => {
    User.create({
      ...req.body,
      password: hashedPass,
    })
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res
            .status(ERROR_CODE)
            .send({ message: 'Введены некорректные данные' });
        } else {
          res
            .status(DEFAULT_ERROR_CODE)
            .send({ message: 'Что-то пошло не так' });
        }
      });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(() => new Error('Пользователь не найден'))
    .then((user) => {
      bcrypt.compare(String(password), user.password).then((isValidUser) => {
        if (isValidUser) {
          const jwt = jsonWebToken.sign({
            _id: user._id,
          }, 'SECRET');
          res.cookie('jwt', jwt, {
            maxAge: 360000,
            httpOnly: true,
            sameSite: true,
          });
          res.send({ data: user.toJSON() });
        } else {
          res.status(403).send({ message: 'Что-то случилось' });
        }
      });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Что-то пошло не так' });
      }
    });
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    { new: true },
  )
    .then((user) => res.send({ avatar: user.avatar }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Что-то пошло не так' }));
};
module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  updateAvatar,
  login,
};
