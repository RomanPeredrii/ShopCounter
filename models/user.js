const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ShopCounter');

let User = mongoose.model('User', {

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

mongoose.options.useNewUrlParser = true;
mongoose.set('useCreateIndex', true);

module.exports = User;