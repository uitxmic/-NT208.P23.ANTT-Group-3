const usersRouter = require('./users');

function routes(app) 
{
    app.get('/test', (req, res) => {
        res.json({message: 'Test route'});
    }
    );

    app.use('/users', usersRouter);

} 

module.exports = routes;