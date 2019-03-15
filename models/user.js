const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ShopCounter', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

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
  },
  host: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  database: {
    type: String,
    required: true
  },
  port: {
    type: String,
    required: true
  },
  pageSize: {
    type: String,
    required: true
  },
  point: {
    type: String,
  },
  address: {
      type: String,
  },
  
});

module.exports = User;