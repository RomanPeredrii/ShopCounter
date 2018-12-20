const log = console.log;
const http = require('http');
const moment = require('moment');
const serverIo = http.createServer();
const io = require('socket.io')(serverIo);

const cookieIo = require('socket.io-cookie');
const cookieParser = require('cookie-parser')
const User = require('../models/user.js');

/*
let testUser = new User({
    username: 'test5',
    password: '1'
  });
  
testUser.save().then((data) => { log(data) });
*/

let dateTime = () => { return (moment().locale('us').format('MMMM Do YYYY, hh:mm:ss a')) };



io.on('connection', function (client) {
    client.emit('onConnect', 'CONNECTED');
   // client.on('sendLogInfo', (UserLogInfo) => {});
});




serverIo.listen(3001);
module.exports = {};