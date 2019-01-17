'use strict';

const log = console.log;
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

    selectionFromDB(req.body.TimeStamp);

    // ДУРКА!!!! ЯК ВОНА Є
    function selectionFromDB(timePoints) {

        let dateStart = new Date(timePoints.timeStart);
        let dateFinish = new Date(timePoints.timeFinish + 86400000);

        var timeS = dateStart.getUTCFullYear() + '-' + (dateStart.getUTCMonth() + 1) + '-' +
            dateStart.getUTCDate() + ' ' + dateStart.getUTCHours() + ':' +
            dateStart.getUTCMinutes() + ':' + dateStart.getUTCSeconds();

        var dateF = timePoints.timeFinish;
        var dateS = timePoints.timeStart;
        log('START:', timeS);
        let e = ((timePoints.timeFinish + 86400000 - timePoints.timeStart) / timePoints.period);
        log('++++++++++++++++', e);
        var arrRes = [];

        let j = 1;

        for (let i = 1; i <= e; i++) {

            dateFinish = new Date(dateF);
            dateStart = new Date(dateS);

            var timeS = dateStart.getUTCFullYear() + '-' + (dateStart.getUTCMonth() + 1) + '-' +
                dateStart.getUTCDate() + ' ' + dateStart.getUTCHours() + ':' +
                dateStart.getUTCMinutes() + ':' + dateStart.getUTCSeconds();

            var timeF = dateFinish.getUTCFullYear() + '-' + (dateFinish.getUTCMonth() + 1) + '-' +
                dateFinish.getUTCDate() + ' ' + dateFinish.getUTCHours() + ':' +
                dateFinish.getUTCMinutes() + ':' + dateFinish.getUTCSeconds();

            dateF = dateF + timePoints.period;
            dateS = dateS + timePoints.period;

            log('START:', timeS);


            getDataFomDb(timeS, timeF, options)
                .then(result => {
                    j++;
                    log(i, e, j, result);
                    arrRes.push(result);
                    if (j - 1 === e) res.json(arrRes);

                })
                .catch(err => log('DB CONNECTION ERROR!', err));



            log('FINISH:', timeF);
            log('***********************');
        };



        // getDataFomDb(timeS, timeF, options)
        //     .then(result => {
        //         if (result) res.json(result)
        //     })
        //     .catch(err => log('DB CONNECTION ERROR!', err));
    }
});






async function getDataFomDb(timePointSart, timePointFinish, accessOptions) {

    let scriptGETSUM = " SELECT SUM(CH1) FROM COUNTERDATA WHERE (CAST(TIMEPOINT AS TIMESTAMP) >= " + "'"
        + timePointSart + "'" + ") AND (CAST(TIMEPOINT AS TIMESTAMP) <= " + "'"
        + timePointFinish + "'" + ") AND CH1 = CH2 ";

    return new Promise((res, rej) => {
        firebird.attach(accessOptions, async (err, db) => {
            if (err) rej(err)
            else res(await queryToDB(scriptGETSUM, db).catch(err => log('SQL SCRIPT ERROR!', err)));
        });
    });

};

function queryToDB(script, db) {
    return new Promise((res, rej) => {
        db.query(script, (err, result) => {
            if (err) rej(err);
            db.detach();
            log('getDataFomDb', result);
            res(result);
        });
    });
};

function dateToUTC(date) {
    let dateArr = date.replace((/-|:|\s/g), ", ").split(',');
    for (let i = 0; i < dateArr.length; i++) {
        if (i === 1)--dateArr[i];
        if (i === 2)++dateArr[i];
    };
    return Date.UTC(...dateArr);
};

function forPaintWeekend(date) {
    date = new Date(date);
    if (date.getDay() === 0 || date.getDay() === 6) return true
    else return false;
};

module.exports = router;