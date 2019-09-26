/* unit for make request to MongoDB */
log = console.log;
const User = require('../models/user.js');
const makeid = require('./stuff.js').makeid;
class MongoRequester {
    constructor() {};

    _throwError(error) {
        throw error;
    };

    // !!! - get user option for attach FirebirdDB from MongoDB according to token
    async getUserOptions(token) {
        try {
            let user = await User.findOne({ token });
            if (!user) {
                log('USER NOT EXIST');
                this._throwError();
                return null
            }
            return {
                host: user.host,
                port: user.port,
                database: user.database,
                department: user.departments,
                // user: user.username,
                // password: user.password,


                /*---------------*/
                user: 'U_VIEW', // JUST FOR RESPECT
                /*---------------*/
                password: 'clv8bzg1', // JUST FOR RESPECT



            };
        } catch (err) { log('\n USER ERROR', err) };
    };
    // !! - get user from mongo
    async getUser(UserLogInfo) {
        log('UserLogInfo', UserLogInfo);
        try {
            let tokenString = makeid();
            let user = await
            User.findOneAndUpdate({
                username: UserLogInfo.userName,
                password: UserLogInfo.pswd
            }, {
                token: tokenString
            });
            if (!user) { log('USER NOT EXIST OR PASSWORD UNCORRECT') } else {
                user.token = tokenString;
            };
            log(user); //null
            return user;
        } catch (err) { log('\n ERROR', err) };
    };

    async addUser(newUser) {
        // !! create new user document
        let user = new User({
            username: newUser.newUser.newUser,
            password: newUser.newUser.newUserPassword,
            host: newUser.host,
            database: newUser.database,
            port: newUser.port,
            departments: newUser.newUser.departments
        });
        // !! - save new user document
        try {
            return await user.save();
        } catch (err) { log('\n SAVE ERROR', err) };
    };

    async delUser(delUser) {
        try {
            let result = await User.findOneAndRemove({ username: delUser });
            log('result', result);
            return result;
        } catch (err) { log('\n DELETE ERROR', err) };
    };


};
module.exports = MongoRequester;