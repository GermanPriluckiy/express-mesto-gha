const IncorrectDataError = require('../errors/IncorrectDataError');
const DefaultError = require('../errors/DefaultError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const errorHandler = (err, req, res, next) => {
  let error;

  switch (err.name) {
    case 'CastError':
      error = new IncorrectDataError('Неверные данные');
      break;
    case 'Error':
      error = err;
      break;
    case 'JsonWebTokenError':
      error = new UnauthorizedError('Нужно пройти авторизацию');
      break;
    case 'Bad Request':
      error = new IncorrectDataError('Неверные данные');
      break;
    default:
      error = new DefaultError('Что-то пошло не так');
  }
  res.status(error.statusCode).send({ message: error.message });
  next();
};

module.exports = errorHandler;
