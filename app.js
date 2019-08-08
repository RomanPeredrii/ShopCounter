'use strict'
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

require('./routes/index.js')(app);

module.exports = app;