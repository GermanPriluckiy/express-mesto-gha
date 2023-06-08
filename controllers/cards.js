const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(400).send({ message: 'Critical error', err: err.message }));
};

const createCard = (req, res) => {
  Card.create({
    owner: req.user._id,
    ...req.body,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => res.status(400).send({ message: 'Critical error', err: err.message }));
};

const deleteCard = (req, res) => {
  if (!req.params.cardId) {
    return res.status(404).send({ message: 'Card not found' });
  }
  return Card.deleteOne({ _id: req.params.cardId })
    .then((card) => res.status(200).send(card))
    .catch((err) => res.status(400).send({ message: 'Invalid id type', err: err.message }));
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => res.status(200).send(card))
  .catch((err) => res.status(400).send({ message: 'Critical error', err: err.message }));

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => res.status(200).send(card))
  .catch((err) => res.status(400).send({ message: 'Critical error', err: err.message }));
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
