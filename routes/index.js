const usersRouter = require('./users');
const voucherRouter = require('./voucher');
const postingRouter = require('./posting');

function routes(app) 
{
    app.get('/test', (req, res) => {
        res.json({message: 'Test route'});
    }
    );

    app.use('/users', usersRouter);

    app.use('/voucher', voucherRouter);

    app.use('/posting', postingRouter);

} 

module.exports = routes;