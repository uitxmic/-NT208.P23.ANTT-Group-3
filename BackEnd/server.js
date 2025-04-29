const { createServer } = require('node:http');
require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME;

const routes = require('./routes/index');


// Ensure routes is a function
if (typeof routes === 'function') {
  routes(app);
} else {
  console.error('Routes is not a function');
}

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});