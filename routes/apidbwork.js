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

// !! - OPTION FOR ATTACH DB
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
                counters: user.counters,
                department: user.department,
                products: user.products
            };
        };
        return options;
    } catch (err) { log('\n USER ERROR', err) };
};



// !! - the main router
router.post('/apidbwork', async (req, res, next) => {
    let userOptions = await getUserOptions(req.cookies.token);
    // !! - send start date of COUNTERDATA 
    if (req.body.request.startValue) {
        log(1);
        res.json((await makeQuery(userOptions, "SELECT MIN (TIMEPOINT) FROM COUNTERDATA")
            .then(res => { res.push(userOptions); return res })
            .catch(err => { log('REJ ERROR', err); log(err) })));
    }

    // !! - send data according to user's request for bar chart (with sql injection defense)
    else if ((req.body.request.timeStamp) && (!req.body.request.pieChart)) {
        log(2);
        let countersArr = userOptions.counters.split(';');
        countersArr.pop();
        let serialArr = [];
        req.body.request.serial.map((serial) => { serialArr.push(countersArr[serial]) })
        res.json(await selectionFromDB(req.body.request.timeStamp, req.cookies.token, serialArr));
    }

    // !! - send data according to user's request for pie chart (with sql injection defense)
    else if ((req.body.request.timeStamp) && (req.body.request.pieChart)) {
        log(3);
        let countersArr = userOptions.counters.split(';');
        countersArr.pop();
        let serialArr = [];
        req.body.request.serial.map((serial) => { serialArr.push(countersArr[serial]) })
        res.json(await selectionFromDBforPieChart(req.body.request.timeStamp, req.cookies.token, serialArr));
    }

    // !! - send data according to user's request (with sql injection defense)
    else
        if (req.body.request.timeStamp) {
            log(2);
            let countersArr = userOptions.counters.split(';');
            countersArr.pop();
            let serialArr = [];
            req.body.request.serial.map((serial) => { serialArr.push(countersArr[serial]) })
            res.json(await selectionFromDB(req.body.request.timeStamp, req.cookies.token, serialArr));
        };
    // ДУРКА!!!! ЯК ВОНА Є

});


// !! - getDataFomDb according to client conditions from request body
async function getDataFomDb(timePointSart, timePointFinish, accessOptions, serials) {
    //log('accessOptions', serials);
    return new Promise((res, rej) => {
        firebird.attach(accessOptions, async (err, db) => {
            if (err) { log(err); rej(err) }
            else {
                let arr = [timePointSart, timePointFinish];
                arr.push(await queryToDB(scriptGetSUM(timePointSart, timePointFinish, serials), db)
                    .catch(err => log('SQL SCRIPT ERROR!', err)));
                res(arr);
            };
        });
    });
};


// !! - request to firebird must be refactored & united with queryToDB
async function makeQuery(options, script) {
    return new Promise((res, rej) => {
/*??????*/ try {
            firebird.attach(options, async (err, db) => {
                if (err) { log('ERR', err); rej(err) }
                else {
                    //log('---------->', script);
                    var resQ = new Promise((res, rej) => {
                        db.execute(script, (err, result) => {
                            if (err) rej(err);
                            res(result);
                        });
                    });
                    res(await resQ.then(res => {
                        /*log('res---------->', res);*/
                        return res
                    }).catch(err => { log('REJ ERROR', err) })
                        .finally(db.detach()));
                };
            });
        }
        catch (err) {
            ('makeQuery ERROR', log(err))
        };
    });
};

// !! - make time stamps for requests to firebird according to clients requst bar chart

async function selectionFromDB(timePoints, token, serials) {
    let dateStart = new Date(timePoints.timeStart);
    let dateFinish = new Date(timePoints.timeFinish + 86400000);
    let step = ((timePoints.timeFinish + 86400000 - timePoints.timeStart) / timePoints.period);
    let arrRes = [];

    //log('step', step);
    for (let i = 0; i < step; i++) {

        timePoints.timeFinish = timePoints.timeStart + timePoints.period;
        dateFinish = new Date(timePoints.timeFinish);
        dateStart = new Date(timePoints.timeStart);

        //log('selectionFromDB', serials);
        // !! - make response array
        arrRes.push(await getDataFomDb(makeDateString(dateStart), makeDateString(dateFinish), await getUserOptions(token), serials).
            catch(err => log('CONNECTION TO DB ERROR ', err)));

        timePoints.timeFinish = timePoints.timeStart + timePoints.period;
        timePoints.timeStart += timePoints.period;
    };
    return (arrRes);
};

async function selectionFromDBforPieChart(timePoints, token, serials) {
    let dateStart = new Date(timePoints.timeStart);
    let dateFinish = new Date(timePoints.timeFinish + 86400000);
    let arrRes = [];

    log('dateStart', dateStart);
    log('dateFinish', dateFinish);
    log('selectionFromDBforPieChart', serials);
    // !! - make response array


    for (let i = 0; i < serials.length; i++) {
        let serial = [serials[i]];
        let rawData = (await getDataFomDb(makeDateString(dateStart), makeDateString(dateFinish), await getUserOptions(token), serial).
            catch(err => log('CONNECTION TO DB ERROR ', err)));
        rawData.push(serials[i]);
        arrRes.push(rawData);
       // log("arrRes->>", arrRes);
    };
    log("arrRes", arrRes);
    return (arrRes);
};

// !! - request to firebird must be refactored 
function queryToDB(script, db) {
    // log(script);
    return new Promise((res, rej) => {
        db.query(script, (err, result) => {
            if (err) rej(err);
            db.detach();
            if (!result[0].SUM) result[0].SUM = 0;
            res(Math.round(result[0].SUM));
        });
    });
};

// !! - unusable function
// function dateToUTC(date) {
//     let dateArr = date.replace((/-|:|\s/g), ", ").split(',');
//     for (let i = 0; i < dateArr.length; i++) {
//         if (i === 1)--dateArr[i];
//         if (i === 2)++dateArr[i];
//     };
//     return Date.UTC(...dateArr);
// };

// !! - make date for script
function makeDateString(dateVal) {
    return (dateVal.getUTCFullYear() + '-' + (dateVal.getUTCMonth() + 1) + '-' +
        dateVal.getUTCDate() + ' ' + dateVal.getUTCHours() + ':' +
        dateVal.getUTCMinutes() + ':' + dateVal.getUTCSeconds());
};


// !! - make scriptGetSUM according to request
function scriptGetSUM(timePointS, timePointF, serials) {
    let scriptCondition = '';
    for (let i = 0; i < serials.length; i++) {
        if (i === (serials.length - 1)) scriptCondition += 'SERIAL' + " = " + "'" + serials[i] + "'"
        else scriptCondition += 'SERIAL' + " = " + "'" + serials[i] + "'" + " OR ";
    };
    log((" SELECT SUM(CH1) FROM COUNTERDATA WHERE (CAST(TIMEPOINT AS TIMESTAMP) >= "
        + "'" + timePointS + "'" + ") AND (CAST(TIMEPOINT AS TIMESTAMP) <= "
        + "'" + timePointF + "'" + ") AND ( " + scriptCondition + " )"));
    return (" SELECT SUM(CH1) FROM COUNTERDATA WHERE (CAST(TIMEPOINT AS TIMESTAMP) >= "
        + "'" + timePointS + "'" + ") AND (CAST(TIMEPOINT AS TIMESTAMP) <= "
        + "'" + timePointF + "'" + ") AND ( " + scriptCondition + " )");
};


module.exports = router;