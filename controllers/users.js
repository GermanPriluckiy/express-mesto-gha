const { ObjectId } = require('mongoose').Types;
const User = require('../models/user');

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
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ message: 'Critical error', err: err.message }));
};

const getUserById = (req, res) => {
  if (isValidObjectId(req.params.userId)) {
    return User.findById(req.params.userId)
      .orFail(() => new Error('Not found'))
      .then((user) => res.status(200).send(user))
      .catch((err) => {
        if (err.message === 'Not found') {
          res.status(404).send({ message: 'User not found' });
        } else {
          res.status(500).send({ message: 'Critical error', err: err.message });
        }
      });
  }

  return res.status(500).send({ message: 'Invalid id type' });
};
const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => res.status(500).send({ message: 'Critical error', err: err.message }));
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
};