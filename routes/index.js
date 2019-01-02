var log = console.log;
var express = require('express');
var router = express.Router();
const checkAuth = require('../modules/authentication.js');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'YOU WELCOME', logged: true });
});

module.exports = router;
