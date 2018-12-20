var log = console.log;
const User = require('../models/user.js');
const m = {};


m.checkToken = async (token) => {
  try { log('TOKEN', token);
   return await User.findOne({token});   
  } catch (error) { log(error) };
};

module.exports = m;