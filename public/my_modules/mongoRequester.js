/* unit for make request to MongoDB */
log = console.log;
const User = require('../../models/user.js');
const makeid = require('./stuffBE.js').makeid;
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
                user: user.username,
                password: user.password,
                pageSize: user.pageSize,
                role: user.role,
                counters: user.counters,
                department: user.department,
                products: user.products
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

};
module.exports = MongoRequester;