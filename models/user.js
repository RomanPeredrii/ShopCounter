const mongoose = require('mongoose');

let User = mongoose.model ( 'User', {

    username: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    token: {
      type: String,
    }
  });
 

  module.exports = User;