require('dotenv').config();
const { createServer } = require('node:http');
const hbs = require('express-handlebars');
const routes = require('./routes/index');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const sessionMiddleware = require('./middlewares/init.redis');
const closeConnection = require('./middlewares/dbConnection').closeConnection;

const corsOptions = {
  origin: ['http://localhost:5173', 'https://ripe-phones-play.loca.lt'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Đảm bảo gửi và nhận cookie
};

const express = require('express');
const path = require('node:path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(sessionMiddleware);

//Template engine
app.engine('hbs', hbs.engine({
  extname: 'hbs',
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

routes(app);

const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME;

// Ensure routes is a function
if (typeof routes === 'function') {
  routes(app);
} else {
  console.error('Routes is not a function');
}

process.on('SIGINT', async () => {
  console.log('Received SIGINT. Closing server...');
  await closeConnection();
  console.log('Database connection closed.');
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});