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

    log(forPaintWeekend(req.body.TimeStamp.timeStart));
    selectionFromDB(req.body.TimeStamp);


    /*
    let scriptGETDATA = " SELECT * FROM COUNTERDATA WHERE TIMEPOINT >= " + "'" + tryDateTimeStamp + "'" + " AND TIMEPOINT <= " + "'" + req.body.TimeStamp.timeFinish + "'";
    // let scriptGETSUM = " SELECT SUM(CH1) FROM COUNTERDATA WHERE  (CAST(TIMEPOINT AS DATE) >= " + "'"+ req.body.TimeStamp.timeStart + "'" + ") AND (CAST(TIMEPOINT AS DATE) <= " + "'"+ req.body.TimeStamp.timeFinish + "'" + ") AND CH1 = CH2 ";
    firebird.attach(options, (err, db) => {
        if (err) res.json(err)
        //else log("ATTACHED");
        db.query(scriptGETDATA, (err, result) => {
            if (err) log(err);
            db.detach();
            //log("DETACHED");
            //result.map((result) => log('RESULT = ', result));
          //  res.json(result);
        });
    });
*/



function forPaintWeekend(date) {
    d = new Date(date);
    if (d.getDay() === 0 || d.getDay() === 6) return true
    else return false;
};


function selectionFromDB(timePoints) {
    log('TIMEPOINTS:', timePoints);
    log('PERIOD:', timePoints.period);
    let dateStart = new Date(timePoints.timeStart);
    let dateFinish = new Date(timePoints.timeFinish + ' 23:59:59:999');



    let timeS = dateStart.getFullYear() + '-' + (dateStart.getMonth() + 1) + '-' +
        dateStart.getDate() + ' ' + dateStart.getUTCHours() + ':' +
        dateStart.getMinutes() + ':' + dateStart.getSeconds();

    let timeF = dateFinish.getFullYear() + '-' + (dateFinish.getMonth() + 1) + '-' +
        dateFinish.getDate() + ' ' + dateFinish.getHours() + ':' +
        dateFinish.getMinutes() + ':' + dateFinish.getSeconds();


    log('***********************');
    log('START:', timeS);
    log('FINISH:', timeF);
    log('***********************');



    let scriptGETSUM = " SELECT SUM(CH1) FROM COUNTERDATA WHERE (CAST(TIMEPOINT AS TIMESTAMP) >= " + "'"
        + timeS + "'" + ") AND (CAST(TIMEPOINT AS TIMESTAMP) <= " + "'"
        + timeF + "'" + ") AND CH1 = CH2 ";

    firebird.attach(options, (err, db) => {
        if (err) res.json(err)
        else //log("ATTACHED");
            db.query(scriptGETSUM, (err, result) => {
                if (err) log(err);
                db.detach();
                //log("DETACHED");
                log(result);
                res.json(result);
            });
    });

}
});

module.exports = router;