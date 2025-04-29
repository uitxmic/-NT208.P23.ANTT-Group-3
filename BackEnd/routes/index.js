const usersRouter = require('./users');
const voucherRouter = require('./voucher');
const postingRouter = require('./posting');
const tradeRouter = require('./trade');
const notificationRouter = require('./notification');
const newsRouter = require('./news');
const searchRouter = require('./search');
function routes(app) 
{
    app.get('/test', (req, res) => {
        res.json({message: 'Test route'});
    }
    );
    app.use('/search', searchRouter);

    app.use('/users', usersRouter);

    app.use('/voucher', voucherRouter);

    app.use('/posting', postingRouter);

    app.use('/trade', tradeRouter);

    app.use('/notification', notificationRouter);

    app.use('/news', newsRouter);
} 

module.exports = routes;