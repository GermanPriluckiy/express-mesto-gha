const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/error');
const router = require('./routes');

const app = express();

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(cookieParser());

app.use(router);

app.use((req, res) => {
  res.status(404).send({ message: 'Путь не найден' });
});

//app.use(errorHandler);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3000');
});
