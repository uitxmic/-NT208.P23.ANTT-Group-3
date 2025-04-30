const path = require('node:path'); // Giữ lại nếu dùng trong config path
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const routes = require('./routes/index'); // require routes SAU dotenv
const { createServer } = require('node:http');
const hbs = require('express-handlebars');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const corsOptions = {
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const express = require('express');
const sessionMiddleware = require("./middlewares/init.redis"); // Import session middleware
const e = require('express');
const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(sessionMiddleware);

//Template engine
app.engine('hbs', hbs.engine({
  extname: 'hbs',
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
routes(app);

const port = process.env.port || 3000;
const hostname = process.env.hostname || 'localhost';

if (typeof routes === 'function') {
  routes(app);
} else {
  console.error('Routes is not a function');
}

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});