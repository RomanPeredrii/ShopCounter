var log = console.log;
var express = require('express');
var router = express.Router();
const checkAuth = require('../modules/authentication.js');


router.all('/*', (req, res, next) => {
  log('******')
  if (req.cookies.token === undefined) return res.render('index.pug', { title: 'YOU WELCOME', logged: false });
  checkAuth.checkToken(req.cookies.token).
    then((user) => {
      log('API USER', user)
      if (user) {
        next();
      } else {
        return res.render('index.pug', { title: 'YOU WELCOME', logged: false })
      };
    });
});


/* API GET WORK page. */
router.get('/work', (req, res, next) => {
  res.render('work.pug', { title: 'WORK PAGE', logged: true });
});
/* API GET ADMIN page. */
router.get('/admin', (req, res, next) => {
  res.render('admin.pug', { title: 'ADMIN PAGE', logged: true });
});

module.exports = router;