log = console.log;
var express = require('express');
var router = express.Router();
var firebird = require('node-firebird');
var options = {};

// OPTION FOR ATTACH DB
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


    function forPaintWeekend(date) {
        d = new Date(date);
        if (d.getDay() === 0 || d.getDay() === 6) return true
        else return false;
    };

    // ДУРКА!!!! ЯК ВОНА Э
    function selectionFromDB(timePoints) {
        log('TIMEPOINTS:', timePoints);
        log('PERIOD:', timePoints.period);

        let dateStart = new Date(timePoints.timeStart);
        let dateFinish = new Date(timePoints.timeFinish + ' 23:59:59:999');

        log('valueOfStart', dateStart.valueOf());
        log('valueOfFinish', dateFinish.valueOf());

        let d1 = dateStart.valueOf();
        let d2 = dateFinish.valueOf();
        let d11 = new Date(d1);
        let d22 = new Date(d2);
        log('NewOfStart', d11);
        log('NewOfFinish', d22);


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


        getDataFomDb(timeS, timeF, options).then((result) => res.json(result));
    }
});



async function getDataFomDb(timePointSart, timePointFinish, accessOptions) {

    return new Promise((res, rej) => {
        firebird.attach(accessOptions, async (err, db) => {
            try {
                if (err) rej(err)
                else res(await queryToDB(timePointSart, timePointFinish, db));
            }
            catch (err) { log(err) };
        });
    });

};

function queryToDB(timePointSart, timePointFinish, db) {

    let scriptGETSUM = " SELECT SUM(CH1) FROM COUNTERDATA WHERE (CAST(TIMEPOINT AS TIMESTAMP) >= " + "'"
        + timePointSart + "'" + ") AND (CAST(TIMEPOINT AS TIMESTAMP) <= " + "'"
        + timePointFinish + "'" + ") AND CH1 = CH2 ";

    try {
        return new Promise((res, rej) => {
            db.query(scriptGETSUM, (err, result) => {
                if (err) rej(err);
                db.detach();
                log('getDataFomDb', result);
                res(result);
            });
        });
    }
    catch (err) { log(err) };
};


module.exports = router;