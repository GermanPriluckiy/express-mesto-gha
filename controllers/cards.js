const Card = require('../models/card');

const ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

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
  Card.findByIdAndDelete({ _id: req.params.cardId })
    .then((card) => res.status(200).send(card))
    .catch((err) => res.status(400).send(err));
//   if (!Card.findById(req.params.cardId)) {
//     return res.status(404).send({ message: 'Карточка не найдена' });
//   }
//   return Card.deleteOne({ _id: req.params.cardId })
//     .then((card) => res.status(200).send(card))
//     .catch((err) => res.status(400).send(err));
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => res.status(200).send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      res
        .status(NOT_FOUND_ERROR_CODE)
        .send({ message: 'Введены некорректные данные' });
    } else {
      res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: 'Что-то пошло не так' });
    }
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => res.status(200).send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      res
        .status(NOT_FOUND_ERROR_CODE)
        .send({ message: 'Введены некорректные данные' });
    } else {
      res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: 'Что-то пошло не так' });
    }
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
