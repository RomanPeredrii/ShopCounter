const log = require('./stuff').log;
const router = require('express').Router();
const MongoRequester = require('./mongoRequester');


router.post('/login', async(req, res, next) => {
    log('/login here');
    const mongoRequester = new MongoRequester();
    const result = {
        ok: false,
        admin: false,
        error: false,
        unlogged: false
    };
    // !! - get session 
    mongoRequester.getUser(req.body).then((user) => {
        log(user);
        if (!user) res.json(null);
        else if (user.token) {
            result.ok = true;
            result.logged = true;
            res.cookie('token', user.token, { maxAge: 60000000, httpOnly: true })
        };
        if (user.username === "Admin") {
            result.ok = false;
            result.admin = true;
            result.logged = true;
        };
        res.json(result);
    }).catch((err) => {
        log('getUser ERROR', err);
        result.error = true;
        res.json(result);
    });
});








module.exports = router;