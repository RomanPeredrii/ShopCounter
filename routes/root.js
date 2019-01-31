const log = console.log;
//var express = require('express');
var router = require('express').Router();
//const checkAuth = require('../modules/authentication.js');

// router.post('/*', function (req, res, next) {
//     if (!req.body) res.json({ code: 401, msg: 'No Body' })
//     next()
// })
// /* GET home page. */

router.all('/*', async (req, res, next) => {
    // let ep = req.url
    // log('\n programs ::::::::::::::::::::::::::::::::::::::::::::::::'.help)
    // log(req.url.info, '\n')
    // log(req.url)
    //
    next()
})

router.get('/', function (req, res, next) {
  res.render('index.pug', { title: 'YOU WELCOME', logged: false });
});
// All

module.exports = router;