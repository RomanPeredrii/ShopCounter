'use strict'

const log = console.log;
const express = require('express');
const router = require('express').Router();
const User = require('../models/user.js');



router.post('/apidbusers', async (req, res, next) => {
  log('**apiDBusers router.post / ', req.body.request);

  for (let opt in req.body.request) {
    if ((!req.body.request[opt]) && (opt !== 'address') && (opt !== 'point')) log('EMPTY PROPERTY:', opt);

  };

  let user = new User(req.body.request);
  try {
    //user.save() ;//async

    // let user = async () => await
    //   User.findOneAndUpdate(
    //      {
    //        username: UserLogInfo.userName,
    //        password: UserLogInfo.pswd
    //      });
    //log('USER', user);

  } 
  catch  (err) { log('SAVE', err) };
});

module.exports = router;


