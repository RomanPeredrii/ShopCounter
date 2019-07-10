/* unit for make request to MongoDB */
log = console.log;
const User = require('../../models/user.js');

class MongoRequester {
    constructor() {
    };

    _throwError(error) {
        throw error;
    };

    // !!! - get user option for attach FirebirdDB from MongoDB according to token
    async getUserOptions(token) {
        log('token', token);
        try {
            let user = await User.findOne({ token });
            if (!user) { log('USER NOT EXIST'); this._throwError(); return null }
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

};
module.exports = MongoRequester;