const { createServer } = require('node:http');
const routes = require('./routes/index');
require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

routes(app);

app.set('view engine', 'pug');
app.set('views', './views');

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