var express = require('express');
var router = express.Router();

// !! - /* All check cookies */
router.all('/*', async (req, res, next) => {
    if ((req.url === '/') || (req.url === '/api/login') || (req.url === '/pages/work')) {
        return next();
    };
    // ? !token ==> ПНХ
    if ((!req.cookies.token) && (req.url.split('/')[1] === 'api')) {
        return res.json({ unlogged: true });
    }

    // ? token ==> cookies.token { maxAge: + 60000000}
    else if ((req.cookies.token) && (req.url.split('/')[1] === 'api'))
        res.cookie('token', req.cookies.token, { maxAge: 60000000, httpOnly: true });
    next();
});

// !! -/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index.pug', { title: 'YOU WELCOME', logged: false });
});
module.exports = router;