const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const app = express();

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6480e2c6bab147df58c54b5b',
  };

  next();
});

app.use(express.json());

app.use('/*', (req, res) => res.status(404).send({ message: 'Путь не найден' }));

app.use(router);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3000');
});
