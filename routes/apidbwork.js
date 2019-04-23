'use strict';

const log = console.log;
// var express = require('express');
// var router = express.Router();
var firebird = require('node-firebird');
const router = require('express').Router();
const User = require('../models/user.js');


const result = {
    ok: false,
    admin: false,
    error: false,
    logged: true
};

// OPTION FOR ATTACH DB
let getUserOptions = async (token) => {
    try {
        let user = await User.findOne({ token });

        //log('getUserOptions ----> USER', user)
        if (!user) { log('USER NOT EXIST') }
        else {
            var options = {
                host: user.host,
                port: user.port,
                database: user.database,
                user: user.username,
                password: user.password,
                pageSize: user.pageSize,
                role: user.role,
                counters: user.counters
            };
        };
        return options;
    } catch (err) { log('\n USER ERROR', err) };
};

router.post('/apidbwork', async (req, res, next) => {

    serial(getUserOptions(req.cookies).then((opt) => {log(opt)}));
    log(req.cookies.token);

    
    getUserOptions(req.cookies.token).then((opt) => {log(opt)});
    //log('**apiDB router.post / ');
    selectionFromDB(req.body.TimeStamp);

    // ДУРКА!!!! ЯК ВОНА Є
    async function selectionFromDB(timePoints) {

        let dateStart = new Date(timePoints.timeStart);
        let dateFinish = new Date(timePoints.timeFinish + 86400000);
        let step = ((timePoints.timeFinish + 86400000 - timePoints.timeStart) / timePoints.period);
        let arrRes = [];
        for (let i = 0; i < step; i++) {

            timePoints.timeFinish = timePoints.timeStart + timePoints.period;
            dateFinish = new Date(timePoints.timeFinish);
            dateStart = new Date(timePoints.timeStart);

            // await getDataFomDb(makeDateString(dateStart), makeDateString(dateFinish), options)
            //     .then((result) => arrRes.push(result)).catch(err => log('CONNECTION TO DB ERROR ', err));

            arrRes.push(await getDataFomDb(makeDateString(dateStart), makeDateString(dateFinish), await getUserOptions(req.cookies.token)).
                catch(err => log('CONNECTION TO DB ERROR ', err)));

            timePoints.timeFinish = timePoints.timeStart + timePoints.period;
            timePoints.timeStart += timePoints.period;
        };

        //    result.data = arrRes;
        //    log('**arrRes', result.data);       
        res.json((arrRes));
    };
});


async function getDataFomDb(timePointSart, timePointFinish, accessOptions) {
    log('accessOptions', accessOptions);
    return new Promise((res, rej) => {
        firebird.attach(accessOptions, async (err, db) => {
            if (err) { log(err); rej(err) }
            else {
                let arr = [timePointSart, timePointFinish];
                arr.push(await queryToDB(scriptGetSUM(timePointSart, timePointFinish), db)
                    .catch(err => log('SQL SCRIPT ERROR!', err))); //log(arr);
                res(arr);
            };
        });
    });
};



function queryToDB(script, db) {
    return new Promise((res, rej) => {
        db.query(script, (err, result) => {
            if (err) rej(err);
            db.detach();
            log('--> func! getDataFomDb', script, result[0].SUM);
            if (!result[0].SUM) result[0].SUM = 0;
            res(Math.round(result[0].SUM));
             log(result)
            // res(result);
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

function makeDateString(dateVal) {
    return (dateVal.getUTCFullYear() + '-' + (dateVal.getUTCMonth() + 1) + '-' +
        dateVal.getUTCDate() + ' ' + dateVal.getUTCHours() + ':' +
        dateVal.getUTCMinutes() + ':' + dateVal.getUTCSeconds());
};

async function serial(serial) {
    log(serial);
};

function scriptGetSUM(timePointS, timePointF) {
    return (" SELECT SUM(CH1) FROM COUNTERDATA WHERE (CAST(TIMEPOINT AS TIMESTAMP) >= "
        + "'" + timePointS + "'" + ") AND (CAST(TIMEPOINT AS TIMESTAMP) <= "
        + "'" + timePointF + "'" + ") AND CH1 = CH2 "); // put counters conditions here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
};







module.exports = router;