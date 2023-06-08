const { ObjectId } = require('mongoose').Types;
const Card = require('../models/card');

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

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Что-то пошло не так' }));
};

const createCard = (req, res) => {
  Card.create({
    owner: req.user._id,
    ...req.body,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Что-то пошло не так' });
      }
    });
};

const deleteCard = (req, res) => {
  if (isValidObjectId(req.params.cardId)) {
    return Card.findByIdAndDelete({ _id: req.params.cardId })
      .orFail(() => new Error('Not found'))
      .then((card) => res.status(200).send(card))
      .catch((err) => {
        if (err.message === 'Not found') {
          res
            .status(NOT_FOUND_ERROR_CODE)
            .send({ message: 'Карточка не найдена' });
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

const likeCard = (req, res) => {
  if (isValidObjectId(req.params.cardId)) {
    return Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .orFail(() => new Error('Not found'))
      .then((card) => res.status(200).send({ data: card.likes }))
      .catch((err) => {
        if (err.message === 'Not found') {
          res
            .status(NOT_FOUND_ERROR_CODE)
            .send({ message: 'Карточка не найдена' });
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

const dislikeCard = (req, res) => {
  if (isValidObjectId(req.params.cardId)) {
    return Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
      .orFail(() => new Error('Not found'))
      .then((card) => res.status(200).send({ data: card.likes }))
      .catch((err) => {
        if (err.message === 'Not found') {
          res
            .status(NOT_FOUND_ERROR_CODE)
            .send({ message: 'Карточка не найдена' });
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

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
