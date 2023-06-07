const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ message: 'Critical error', err: err.message }));
};

const createCard = (req, res) => {
  Card.create({
    owner: req.user._id,
    ...req.body,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => res.status(500).send({ message: 'Critical error', err: err.message }));
};

module.exports = {
  getCards,
  createCard,
};
