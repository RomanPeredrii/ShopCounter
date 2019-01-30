var log = console.log;
var express = require('express');
var router = express.Router();
const checkAuth = require('../modules/authentication.js');

router.all('/*', (req, res, next) => { log('******')
  //log('ROUTER COOKIE', req.cookies);
  //log('USER', req.body.UserLogInfo /*|| 'USER UNDEFINED'*/);
  if (req.cookies.token === undefined) {res.json('NOT LOGGED')}
  checkAuth.checkToken(req.cookies.token).
    then((user) => {
      log('API USER', user)
      if (user) {          
        //log('ROUTER USER', user.token)
        next();
      } else { 
        res.json('NOT LOGGED');
      };
    });
});


/* API GET WORK page. */
router.get('/work', (req, res, next) => {
  res.render('work.pug', { title: 'YOU WELCOME', logged: true });
});
/* API GET ADMIN page. */
router.get('/admin', (req, res, next) => {
  res.render('admin.pug', { title: 'YOU WELCOME', logged: true });
});

module.exports = router;