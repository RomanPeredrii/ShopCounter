'use strict'

const log = console.log;
const express = require('express');
const router = require('express').Router();
const firebird = require('node-firebird');
const User = require('../models/user.js');



const response = {
    ok: 'here',
    admin: false,
    error: false,
    logged: true,
    connected: false
};


router.post('/apidbadmin', async (req, res, next) => {

    log('**apiDBadmin router.post / ', req.body.options);



    let scriptGETTABLES = " SELECT RDB$RELATION_NAME FROM RDB$RELATIONS WHERE (RDB$RELATION_TYPE = 0) AND (RDB$SYSTEM_FLAG IS DISTINCT FROM 1)";
   // let scriptGETCOLS = "SELECT RDB$FIELD_NAME FROM RDB$RELATION_FIELDS WHERE RDB$SYSTEM_FLAG = 0 AND RDB$RELATION_NAME = " + shTABLE;
  let scriptGETDATA = " SELECT SUM(CH1) FROM COUNTERDATA WHERE (CAST(TIMEPOINT AS TIMESTAMP) >= '2018-7-31 5:0:0') AND (CAST(TIMEPOINT AS TIMESTAMP)  <= '2018-8-1 8:0:0') AND SERIAL = '0309' ";
    firebird.attach(req.body.options, function (err, db) {


        if (err) throw err
        else {

            db.on('result', (result) => {
                //log(result);
                response.connected = true;
                let tableList = [];
                for (let RDB in result) {
                    for (let name in result[RDB]) {

                        tableList.push(result[RDB][name].replace(/\s+/g, ''));

                    };

                }
                log(tableList);
                res.json(tableList);
            });
            //  log("ATTACHED");
            db.query(scriptGETTABLES, function (err, result) {
                if (err) throw err;

                // log("DETACHED");
                //log(result);
                db.detach();
                //log(typeof result );
                // for (let RDB in result) {
                //     for (let name in result[RDB]) {
                //         //log(typeof name);
                //         // log(result[RDB][name]);
            });
        };
    });


    // queryToDB(req.body.options).catch(err => log("DB", err));

    // async function queryToDB(options) {

    //     try {
    //         firebird.attach(options, function (err, db) {
    //             if (err) {
    //                 log('attach', err)
    //                 throw err
    //             }
    //             else {
    //                 // db.on('attach', () => { log("ATTACHED") });
    //                 // result.connected = true;

    //                 db.query(" SELECT SUM(CH1) FROM COUNTERDATA WHERE (CAST(TIMEPOINT AS TIMESTAMP) >= '2018-7-31 5:0:0') AND (CAST(TIMEPOINT AS TIMESTAMP)  <= '2018-8-1 8:0:0') AND SERIAL = '0309' ", (err, result) => {

    //                     try {
    //                         if (err) throw err;
    //                         log(result);
    //                         return result;
    //                     } catch (error) {
    //                         log("SCRIPT", err)

    //                     }

    //                 });
    //             }
    //             db.detach();

    //             });



    //         log('check', result);
    //         res.json(result);

    //     } catch (err) {

    //     }

    // };
});

// async function getDataFomDb(timePointSart, timePointFinish, accessOptions) {

//     return new Promise((res, rej) => {
//         firebird.attach(accessOptions, async (err, db) => {
//             if (err) rej(err)
//             else {
//                 let arr = [timePointSart, timePointFinish];
//                 arr.push(await queryToDB(scriptGetSUM(timePointSart, timePointFinish), db)
//                     .catch(err => log('SQL SCRIPT ERROR!', err))); //log(arr);
//                 res(arr);
//             };
//         });
//     });
// };



// function queryToDB(script, db) {
//     return new Promise((res, rej) => {
//         db.query(script, (err, result) => {
//             if (err) rej(err);
//             db.detach();
//             //log('--> func! getDataFomDb', script, result[0].SUM);
//             if (!result[0].SUM) result[0].SUM = 0;
//             res(Math.round(result[0].SUM));
//         });
//     });
// };

// function dateToUTC(date) {
//     let dateArr = date.replace((/-|:|\s/g), ", ").split(',');
//     for (let i = 0; i < dateArr.length; i++) {
//         if (i === 1)--dateArr[i];
//         if (i === 2)++dateArr[i];
//     };
//     return Date.UTC(...dateArr);
// };

// function makeDateString(dateVal) {
//     return (dateVal.getUTCFullYear() + '-' + (dateVal.getUTCMonth() + 1) + '-' +
//         dateVal.getUTCDate() + ' ' + dateVal.getUTCHours() + ':' +
//         dateVal.getUTCMinutes() + ':' + dateVal.getUTCSeconds());
// };

// function scriptGetSUM(timePointS, timePointF) {
//     return (" SELECT SUM(CH1) FROM COUNTERDATA WHERE (CAST(TIMEPOINT AS TIMESTAMP) >= "
//         + "'" + timePointS + "'" + ") AND (CAST(TIMEPOINT AS TIMESTAMP) <= "
//         + "'" + timePointF + "'" + ") AND CH1 = CH2 AND SERIAL = '0001'");
// };

module.exports = router;