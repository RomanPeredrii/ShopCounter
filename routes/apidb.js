log = console.log;
var express = require('express');
var router = express.Router();
var firebird = require('node-firebird');
var options = {};

options.host = 'localhost';
options.port = 3050;
options.database = 'D:/JS/vvv/COUNTER.FDB';
options.user = 'SYSDBA';
options.password = 'a2vvczib';
options.pageSize = 4096;
options.role = 'ADMIN';





router.post('/', async (req, res, next) => {

    let scriptGETD = " SELECT CH1 FROM COUNTERDATA WHERE TIMEPOINT >= " + "'"+ req.body.TimeStamp.timeStart + "'" + " AND TIMEPOINT <= " + "'"+ req.body.TimeStamp.timeFinish + "'";

    firebird.attach(options, function (err, db) {
        if (err) res.json(err)
        else
            log("ATTACHED");
        db.query(scriptGETD, function (err, result) {
            if (err) log(err);
            db.detach();
            log("DETACHED");
            //result.map((result) => log(result));
            res.json(result);
        });
    });
});

module.exports = router;