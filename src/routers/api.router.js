const express = require('express');
const router = express.Router();

const authRouter = require('./auth.router');
const authMiddleware = require('../middlewares/auth.middleware');
const userRouter = require('../routers/user.router');
const searchRouter = require('../routers/search.router');
const itemRouter = require('../routers/item.router');
const cartRouter = require('../routers/cart.router');

router.use('/auth', authRouter);
//router.use(authMiddleware.verifyToken);

router.use('/user', userRouter);
router.use('/search', searchRouter);
router.use('/item', itemRouter);
router.use('/cart', cartRouter);
module.exports = router;
