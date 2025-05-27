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
const sessionRoutes = require('./session');

function routes(app) {
    app.get('/test', (req, res) => {
        res.json({ message: 'Test route' });
    }
    );

    app.use('/users', usersRouter);

    app.use('/voucher', voucherRouter);

    app.use('/posting', postingRouter);

    app.use('/trade', tradeRouter);

    app.use('/notification', notificationRouter);

    app.use('/googlecloud', googlecloud);

    app.use('/payment', momoPayment);

    app.get('/dashboard', (req, res) => {
        app.use(authMiddleware);
        res.render('dashboard');
    });

    app.use('/search', searchRouter);

    app.use('/news', newsRouter);

    app.use('/cart', cartRouter);

    app.use('/rating', ratingRouter);

    app.use('/session', sessionRoutes);

}
module.exports = routes;