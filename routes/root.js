"use strict"
var log = console.log;
var express = require('express');
var router = express.Router();

// /* All check cookies */

router.all('/*', async (req, res, next) => {

    if ((req.url === '/') || (req.url === '/api/login') || (req.url === '/pages/work')) {
        return next();
    };

    if ((!req.cookies.token) && (req.url.split('/')[1] === 'api')) {
        return res.json({ unlogged: true }); 
    }
    else if ((req.cookies.token) && (req.url.split('/')[1] === 'api'))
        res.cookie('token', req.cookies.token, { maxAge: 60000000, httpOnly: true });

    next();
});

// /* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index.pug', { title: 'YOU WELCOME', logged: false });
});


module.exports = router;




// error = (err, req, res, status, msg2) => {
//     err = err.toString()
//     log('error Universal'.error, err, status, msg2, '\n')
//     res.json({
//         status,
//         err,
//         success: false,
//         msg: 'Error in ' + req.url,
//         msg2: msg2 || '',
//         from: 'error Universal'
//     })
// }

// send = (result, req, res, msg2) => {
//     res.json({
//         code: '200',
//         result,
//         success: true,
//         msg: 'ok',
//         msg2: msg2 || '',
//         from: 'send Universal'
//     })
// }