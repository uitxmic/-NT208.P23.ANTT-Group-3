const usersRouter = require('./users');
const voucherRouter = require('./voucher');
const postingRouter = require('./posting');
const tradeRouter = require('./trade');
const notificationRouter = require('./notification');
const googlecloud = require('./googlecloud');
const momoPayment = require('./payment');
const authMiddleware = require('../middlewares/authMiddleware');
const searchRouter = require('./search');
const newsRouter = require('./news');
const cartRouter = require('./cart');
const ratingRouter = require('./rating');
const express = require('express');
const sessionRoutes = require('./session');

function routes(app) {

    const apiRouter = express.Router();

    app.get('/test', (req, res) => {
        res.json({ message: 'Test route' });
    }
    );

    apiRouter.use('/users', usersRouter);

    apiRouter.use('/voucher', voucherRouter);

    apiRouter.use('/posting', postingRouter);

    apiRouter.use('/trade', tradeRouter);

    apiRouter.use('/notification', notificationRouter);

    apiRouter.use('/googlecloud', googlecloud);

    apiRouter.use('/payment', momoPayment);

    apiRouter.use('/search', searchRouter);

    apiRouter.use('/news', newsRouter);

    apiRouter.use('/cart', cartRouter);

    app.use('/api', apiRouter);

    apiRouter.use('/rating', ratingRouter);

    apiRouter.use('/session', sessionRoutes);

}
module.exports = routes;