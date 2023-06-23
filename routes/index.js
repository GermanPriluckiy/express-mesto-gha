const router = require('express').Router();
const userRoutes = require('./users');
const cardsRoutes = require('./cards');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signup', createUser);
router.post('/signin', login);

router.use(auth);

router.use('/users', userRoutes);
router.use('/cards', cardsRoutes);

module.exports = router;
