'use strict'

const log = console.log;
const express = require('express');
const router = require('express').Router();
const firebird = require('node-firebird');
const User = require('../models/user.js');


// const response = {
//     ok: 'here',
//     admin: false,
//     error: false,
//     logged: true,
//     connected: false
// };

const scriptGETTABLES = " SELECT RDB$RELATION_NAME FROM RDB$RELATIONS WHERE (RDB$RELATION_TYPE = 0) AND (RDB$SYSTEM_FLAG IS DISTINCT FROM 1)";
const scriptGETFILDS = "SELECT RDB$FIELD_NAME FROM RDB$RELATION_FIELDS WHERE RDB$SYSTEM_FLAG = 0 AND RDB$RELATION_NAME = ";
let scriptGETDATA = (count) => { return ("SELECT FIRST " + count + " * FROM ") };
let scriptADDUSER = (user, password) => { return ("CREATE USER " + user + " PASSWORD " + "'" + password + "'" + " GRANT ADMIN ROLE") };
//const scriptGETDATA = " SELECT * FROM COUNTERDATA WHERE (CAST(TIMEPOINT AS TIMESTAMP) >= '2018-7-31 9:0:0') AND (CAST(TIMEPOINT AS TIMESTAMP)  <= '2018-7-31 11:0:0') AND SERIAL = '0309' ";

router.post('/apidbadmin', async (req, res, next) => {
    log('**apiDBadmin router.post / ', req.body.request.addUser);

    if (req.body.request.addUser) {
        log('**apiDBadmin router.post / "addUser" ', req.body);

        log(scriptADDUSER(req.body.request.username, req.body.request.password));

        // res.json((await makeQuery(req.body.request.options, scriptADDUSER(req.body.request.options.username, req.body.request.options.password))
        //     .then(res => { return res })
        //     .catch(err => { log('REJ ERROR', err); log(err) })));
    }
    else if ((req.body.request.data) && (req.body.request.tableName)) {

        log('**apiDBadmin router.post / "data" ', req.body.request);
        log(scriptGETDATA + req.body.request.tableName);
        res.json((await makeQuery(req.body.request.options, scriptGETDATA(10) + req.body.request.tableName)
            .then(res => { return res })
            .catch(err => { log('REJ ERROR', err); log(err) })));
    }
    else if (req.body.request.tableName) {

        log('**apiDBadmin router.post / "table" ', req.body.request);
        log(scriptGETFILDS + "'" + req.body.request.tableName + "'");
        res.json((await makeQuery(req.body.request.options, scriptGETFILDS + "'" + req.body.request.tableName + "'")
            .then(res => { return res })
            .catch(err => { log('REJ ERROR', err); log(err) })));
    }
    else if (req.body.request.db) {
        log('**apiDBadmin router.post / "options" ', req.body.request);
        res.json((await makeQuery(req.body.request.options, scriptGETTABLES)
            .then(res => { return res })
            .catch(err => { log('REJ ERROR', err); log(err) })));
    };
});

async function makeQuery(options, script) {

    return new Promise((res, rej) => {
        try {
            firebird.attach(options, async (err, db) => {
                if (err) rej(err)
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
                    })//.catch(err => { log('REJ ERROR', err) })
                        .finally(() => db.detach()));
                };
            });
        }
        catch (err) {
            ('makeQuery ERROR', log(err))
        };
    });
};


function makeResponse(inputObj) {
    let outputArr = [];
    for (let fields in inputObj) {
        outputArr.push(Object.entries(inputObj[fields]));
    };
    log('outputArr', outputArr);
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

//a = [...e, ...g]
// let {one, t, ...rest} = {one: 2, sadfas: 11}