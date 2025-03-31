const { createServer } = require('node:http');
const hbs = require('express-handlebars');
const routes = require('./routes/index');
require('dotenv').config();

const express = require('express');
const path = require('node:path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});