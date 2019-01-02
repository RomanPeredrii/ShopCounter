var log = console.log;
var router = require('express').Router();
const User = require('../models/user.js');

router.post('/', function (req, res, next) {
  let user = req.body.UserLogInfo;
  getUser(user).then((user) => {
    if (!user) { log ('!USER', user); return res.json({ ok: false });}
    if (user.token) {
      res.cookie('token', user.token, { maxAge: 120000000, httpOnly: true });
      //client.emit('token', user); 
      res.json({ ok: true });
    }
  });
});

async function getUser(UserLogInfo) {
  try {
    log('USER INCOME ODJECT', UserLogInfo)
    var tokenString = makeid();
    var user = await
      User.findOneAndUpdate(
        {
          username: UserLogInfo.userName,
          password: UserLogInfo.pswd
        },
        {
          token: tokenString
        });
        log('USER', user)
    if (!user) {log('USER NOT EXIST OR PASSWORD UNCORRECT')} else {
      user.token = tokenString;
    };
    return user;
  } catch (err) { log('\n ERROR', err) };
};

function makeid() {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 20; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  };
  log('GENERATE TOKEN', text);
  return text;
}

module.exports = router;