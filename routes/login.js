const log = require('../public/my_modules/stuffBE').log;
const router = require('express').Router();
const MongoRequester = require('../public/my_modules/mongoRequester');


router.post('/login', async (req, res, next) => {
const mongoRequester = new MongoRequester();
  const result = {
    ok: false,
    admin: false,
    error: false,
    unlogged: false
  };
  // !! - get session 
  mongoRequester.getUser(req.body).then((user) => {
    if (!user) res.json(null);
    else if (user.token) {
      result.ok = true;
      result.logged = true;
      res.cookie('token', user.token, { maxAge: 60000000, httpOnly: true })
    };
    if (user.username === "Admin") {
      result.ok = false;
      result.admin = true;
      result.logged = true;
    };
    res.json(result);
  }).catch((err) => { log('getUser ERROR', err); result.error = true; res.json(result); });
});








module.exports = router;
