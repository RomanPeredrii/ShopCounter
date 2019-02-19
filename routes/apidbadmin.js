'use strict'

const log = console.log;
const express = require('express');
const router = require('express').Router();
const firebird = require('node-firebird');
//const User = require('../models/user.js');



// const response = {
//     ok: 'here',
//     admin: false,
//     error: false,
//     logged: true,
//     connected: false
// };

const scriptGETTABLES = " SELECT RDB$RELATION_NAME FROM RDB$RELATIONS WHERE (RDB$RELATION_TYPE = 0) AND (RDB$SYSTEM_FLAG IS DISTINCT FROM 1)";
const scriptGETFILDS = "SELECT RDB$FIELD_NAME FROM RDB$RELATION_FIELDS WHERE RDB$SYSTEM_FLAG = 0 AND RDB$RELATION_NAME = ";
const scriptGETDATA = " SELECT * FROM COUNTERDATA WHERE (CAST(TIMEPOINT AS TIMESTAMP) >= '2018-7-31 5:0:0') AND (CAST(TIMEPOINT AS TIMESTAMP)  <= '2018-8-1 8:0:0') AND SERIAL = '0309' ";

router.post('/apidbadmin', async (req, res, next) => {
    // log('**apiDBadmin router.post / ', req.body.options.options);

    if (req.body.request.tableName) {
        //  log('**apiDBadmin router.post / "tableName" ', req.body.request);
        res.json(makeResponse(await makeQuery(req.body.request.options, scriptGETFILDS + "'" + req.body.request.tableName + "'")
                            .then(res => { return res })
                            .catch(err => log(err))));
    }
    else if (req.body.request.db) {
        //  log('**apiDBadmin router.post / "options" ', req.body.request);
        res.json(makeResponse(await makeQuery(req.body.request.options, scriptGETTABLES)
                            .then(res => { return res })
                            .catch(err => log(err))));
    };
});


async function makeQuery(options, script) {
    try {
        return new Promise((res, rej) => {
            firebird.attach(options, async (err, db) => {
                if (err) rej(err)
                else {
                    var resQ = new Promise((res, rej) => {
                        db.query(script, (err, result) => {
                            if (err) rej(err);
                            res(result);
                        });
                    });
                    res(await resQ.then(res => { return res })
                        .catch(err => log(err))
                        .finally(() => db.detach()));
                };
            });
        });
    }
    catch (err) { ('makeQuery ERROR', log(err)) };
};

function makeResponse(inputObj) {
    //log(inputObj);
    let outputArr = [];
    for (let RDB in inputObj) {
        for (let name in inputObj[RDB]) {
            outputArr.push(inputObj[RDB][name].replace(/\s+/g, ''));
        };
    };
    //log(outputArr);
    return outputArr;
};

module.exports = router;



// // del fee
// router.post('/app-settings-fee-del', async (req, res) => {
//     try {
//         // var-s
//         let user_id = req.body.currentUser._id
//         let i = req.body.i
//         // Get Admin & Barriers
//         let Admin = await getAdminSAFE(user_id, req, res)
//         // Get settings - mean: (list of fee)
//         let state = await App.findOne({ name: 'settings' })
//         // take a list
//         let fee_list = state.fee
//         // remove one fee
//         fee_list.splice(i, 1)
//         // save settings - mean: (new list of fee)
//         let result = await App.findOneAndUpdate({ name: 'settings' }, {
//             fee: fee_list
//         })
//         // send 'ok'
//         send('ok', req, res)
//     } catch (e) {
//         error(e, req, res, 500, 'Cannot Delete Fee ')
//     }
// })