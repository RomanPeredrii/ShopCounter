'use strict'

const log = console.log;
const express = require('express');
const router = require('express').Router();
const User = require('../models/user.js');

router.post('/apidbusers', async (req, res, next) => {
// !! - get user
  for (let opt in req.body.request) {
    if ((!req.body.request[opt]) && (opt !== 'address') && (opt !== 'point')) log('EMPTY PROPERTY:', opt);
  };
  let user = new User(req.body.request.options);
// !! - save new user
  //log(user);
  try {
    user.save() ;
  } 
  catch  (err) { log('SAVE', err) };
});

module.exports = router;


