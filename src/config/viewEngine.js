const path = require('path');
const express = require('express');

const configViewEngine = (app) => {
    app.set('view engine', 'pug');
    app.set('views', './views');
    app.use(express.static('public'));
}

module.exports = configViewEngine;