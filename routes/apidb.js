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

    let scriptGETDATA = " SELECT * FROM COUNTERDATA WHERE TIMEPOINT >= " + "'" + req.body.TimeStamp.timeStart + "'" + " AND TIMEPOINT <= " + "'" + req.body.TimeStamp.timeFinish + "'";
    // let scriptGETSUM = " SELECT SUM(CH1) FROM COUNTERDATA WHERE  (CAST(TIMEPOINT AS DATE) >= " + "'"+ req.body.TimeStamp.timeStart + "'" + ") AND (CAST(TIMEPOINT AS DATE) <= " + "'"+ req.body.TimeStamp.timeFinish + "'" + ") AND CH1 = CH2 ";
    firebird.attach(options, function (err, db) {
        if (err) res.json(err)
        else log("ATTACHED");
        db.query(scriptGETDATA, function (err, result) {
            if (err) log(err);
            db.detach();
            log("DETACHED");
            result.map((result) => log('RESULT = ', result));
            res.json(result);
        });
    });
});

module.exports = router;