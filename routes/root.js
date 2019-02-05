var log = console.log;
var express = require('express');
var router = express.Router();
const checkAuth = require('../modules/authentication.js');


// All
router.all('/*', async (req, res, next) => {
    log('root: req.url', req.url);

    log('root:', req.cookies.token, ' && ', req.url.split('/')[1]);

    if ((req.url === '/') || (req.url === '/api/login')) {
        log("root: ->->->->->->->->->->->"); 
    }
next();
    // if ((!req.cookies.token) && (req.url.split('/')[1] === 'pages')) {
    //     log("root: -------------------------");
    //     res.render('index.pug', { title: 'YOU WELCOME', logged: false });

    //     log('BEFORE NEXT', req.cookies.token, ' && ', req.url.split('/')[1]);
    //     next();
    // };

    // if ((!req.cookies.token) && (req.url.split('/')[1] === 'api')) {
    //     log("root: -------------------------");
    //     res.json({ logged: false });

    //     log('BEFORE NEXT', req.cookies.token, ' && ', req.url.split('/')[1]);
    //     next();
    // };
    //     //     log('/* token:', req.cookies.token);
    //     //     res.render('../views/index.pug', { title: 'YOU WELCOME', logged: false })
    //     // };
    // }
    // log('\n programs ::::::::::::::::::::::::::::::::::::::::::::::::');
    // log('req.url', req.url);
    // log('programs ::::::::::::::::::::::::::::::::::::::::::::::::');


    //return res.render('index.pug', { title: 'YOU WELCOME', logged: false })



});


// router.all('/*', (req, res, next) => {
//     log('******')
//     if (req.cookies.token === undefined) return res.render('index.pug', { title: 'YOU WELCOME', logged: false });
//     checkAuth.checkToken(req.cookies.token).
//       then((user) => {
//         log('API USER', user)
//         if (user) {
//           next();
//         } else {
//           return res.render('index.pug', { title: 'YOU WELCOME', logged: false })
//         };
//       });
//   });

// /* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index.pug', { title: 'YOU WELCOME', logged: false });
});


module.exports = router;