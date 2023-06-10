const User = require('../models/user');

const {
  ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
} = require('../utils/utils');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Что-то пошло не так' }));
};

const getUserById = (req, res) => User.findById(req.params.userId)
  .orFail(() => new Error('Not found'))
  .then((user) => res.send(user))
  .catch((err) => {
    if (err.message === 'Not found') {
      res
        .status(NOT_FOUND_ERROR_CODE)
        .send({ message: 'Пользователь не найден' });
    } else if (err.name === 'CastError') {
      res
        .status(ERROR_CODE)
        .send({ message: 'Введены некорректные данные' });
    } else {
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Что-то пошло не так' });
    }
  });

// const getUserById = (req, res) => {
//   if (isValidObjectId(req.params.userId)) {
//     return User.findById(req.params.userId)
//       .orFail(() => new Error('Not found'))
//       .then((user) => res.send(user))
//       .catch((err) => {
//         if (err.message === 'Not found') {
//           res
//             .status(NOT_FOUND_ERROR_CODE)
//             .send({ message: 'Пользователь не найден' });
//         } else {
//           res
//             .status(DEFAULT_ERROR_CODE)
//             .send({ message: 'Что-то пошло не так' });
//         }
//       });
//   }

//   return res
//     .status(ERROR_CODE)
//     .send({ message: 'Введены некорректные данные' });
// };

const createUser = (req, res) => {
  User.create({
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  })

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
};
