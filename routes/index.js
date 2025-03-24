const usersRouter = require('./users');
const voucherRouter = require('./voucher');
const postingRouter = require('./posting');
const tradeRouter = require('./trade');

function routes(app) 
{
    app.get('/test', (req, res) => {
        res.json({message: 'Test route'});
    }
    );

    app.use('/users', usersRouter);

    app.use('/voucher', voucherRouter);

    app.use('/posting', postingRouter);

    app.use('/trade', tradeRouter);

} 

module.exports = routes;