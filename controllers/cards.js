const NotFoundError = require('../errors/NotFoundError');
const NotOwnerError = require('../errors/NotOwnerError');
const IncorrectDataError = require('../errors/IncorrectDataError');
const Card = require('../models/card');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  Card.create({
    owner: req.user._id,
    name: req.body.name,
    link: req.body.link,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Нет карточки с таким id');
      } else if (card.owner.equals(req.user._id)) {
        Card.deleteOne(card)
          .then((deletedCard) => res.send(deletedCard))
          .catch(next);
      } else {
        throw new NotOwnerError('Нельзя удалять чужую карточку');
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => new NotFoundError('Карточка с данным id не найдена'))
  .then((card) => res.send({ data: card.likes }))
  .catch(next);

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .orFail(() => new NotFoundError('Карточка с данным id не найдена'))
  .then((card) => res.send({ data: card.likes }))
  .catch(next);

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
