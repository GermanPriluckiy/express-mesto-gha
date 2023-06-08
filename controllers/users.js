const { ObjectId } = require('mongoose').Types;
const User = require('../models/user');

const ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

function isValidObjectId(id) {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) {
      return true;
    }
    return false;
  }
  return false;
}

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Что-то пошло не так' }));
};

const getUserById = (req, res) => {
  if (isValidObjectId(req.params.userId)) {
    return User.findById(req.params.userId)
      .orFail(() => new Error('Not found'))
      .then((user) => res.status(200).send(user))
      .catch((err) => {
        if (err.message === 'Not found') {
          res
            .status(NOT_FOUND_ERROR_CODE)
            .send({ message: 'Пользователь не найден' });
        } else {
          res
            .status(DEFAULT_ERROR_CODE)
            .send({ message: 'Что-то пошло не так' });
        }
      });
  }

  return res
    .status(ERROR_CODE)
    .send({ message: 'Введены некорректные данные' });
};
const createUser = (req, res) => {
  User.create(req.body)

    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Что-то пошло не так' });
      }
    });
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
    .then((user) => res.status(200).send({ user }))
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
    .then((user) => res.status(200).send({ message: 'Success update', user }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Что-то пошло не так' }));
};
module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  updateAvatar,
};
