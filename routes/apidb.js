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

let timeStampS = "'2018-05-01'";
let timeStampF = "'2018-06-01'";

let scriptGETD = " SELECT CH1 FROM COUNTERDATA WHERE TIMEPOINT >= " + timeStampS + " AND TIMEPOINT <= " + timeStampF;

router.post('/', async (req, res, next) => {
    let data = req.body;

    firebird.attach(options, function (err, db) {
        if (err)
            throw err
        else
            log("ATTACHED");
        db.query(scriptGETD, function (err, result) {
            if (err) log(err);
            db.detach();
           log("DETACHED");
           result.map((result) => log(result));
           
        });
    });
  });




module.exports = router;