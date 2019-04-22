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
let scriptADDUSER = (user, password) => { return ("CREATE USER " + user + " PASSWORD " + "'" + password + "'") };
let scriptADDUSERPRIV = (user) => { return (" GRANT SELECT ON TABLE COUNTERDATA TO USER " + user) };
let scriptGETCOUNT = (table) => { return ("SELECT COUNT(*) FROM " + table) };
let scriptGETPRODUCTS = (table) => { return ("SELECT DISTINCT PRODDESCR FROM " + table) };

let scriptGETPRODID = (condition, field) => {
    let arrID = condition.split(',');
    arrID.pop();
    let scriptCondition = getID("SELECT PRODID FROM PRODUCTS WHERE ", arrID, field)
    return (scriptCondition);
};
let scriptGETDEPID = (condition, field) => {
    let scriptCondition = getIDdep("SELECT DEPID FROM COUNTERLIST WHERE ", condition, field)
    return (scriptCondition);
};
let scriptGETDEPDESCR = (condition, field) => {
    let scriptCondition = getDEPDESCR("SELECT DEPDESCR FROM DEPARTMENT WHERE ", condition, field)
    return (scriptCondition);
};
// -----------------------------------------------------
let scriptGETDEPARTMENTID = (condition, field) => {
    let arrID = condition.split(',');
    arrID.pop();
    let scriptCondition = getTDEPARTMENTID("SELECT DEPID FROM DEPARTMENT WHERE ", arrID, field)
    return (scriptCondition);
};
//-----------------------------------------------------------
router.post('/apidbadmin', async (req, res, next) => {
    //    log('**apiDBadmin router.post / ', req.body.request.addUser);
    log('**apiDBadmin router.post / "makeReqGetMaxCount" ', req.body.request);

    if ((req.body.request.department) && (req.body.request.tableName === 'DEPARTMENT')) {
        let valDEPID = (await makeQuery(req.body.request.adminOptions, scriptGETDEPARTMENTID(req.body.request.department, 'DEPDESCR'))
        .then(res => { return res })
        .catch(err => { log('REJ ERROR', err); log(err) }));

    }    
    else if ((req.body.request.products) && (req.body.request.tableName === 'COUNTERLIST')) {

        let arrPRODID = (await makeQuery(req.body.request.adminOptions, scriptGETPRODID(req.body.request.products, 'PRODDESCR'))
            .then(res => { return res })
            .catch(err => { log('REJ ERROR', err); log(err) }));

        let arrDEPID = (await makeQuery(req.body.request.adminOptions, scriptGETDEPID(arrPRODID, 'PRODID'))
            .then(res => { return res })
            .catch(err => { log('REJ ERROR', err); log(err) }));

        res.json((await makeQuery(req.body.request.adminOptions, scriptGETDEPDESCR(arrDEPID, 'DEPID'))
            .then(res => { return res })
            .catch(err => { log('REJ ERROR', err); log(err) })));
    }
    else if (req.body.request.products) {
        res.json((await makeQuery(req.body.request.adminOptions, scriptGETPRODUCTS(req.body.request.tableName))
            .then(res => { log(res); return res })
            .catch(err => { log('REJ ERROR', err); log(err) })));
    }

    else if (req.body.request.tableField) {

        log('**apiDBadmin router.post / "makeReqGetMaxCount" ', req.body.request.tableField);

        res.json((await makeQuery(req.body.request.adminOptions, scriptGETCOUNT(req.body.request.tableName))
            .then(res => { log(res); return res })
            .catch(err => { log('REJ ERROR', err); log(err) })));
    }

    else if (req.body.request.addUser) {
        // log('**apiDBadmin router.post / "addUser" options', req.body.request.options);
        // log('**apiDBadmin router.post / "addUser" adminOptions', req.body.request.adminOptions);

        // log(scriptADDUSER(req.body.request.options.username, req.body.request.options.password));
        // log(scriptADDUSERROLE(req.body.request.options.username, req.body.request.options.password));
        res.json((await makeQuery(req.body.request.adminOptions, scriptADDUSER(req.body.request.options.username, req.body.request.options.password))
            .then(res => { return res })
            .catch(err => { log('REJ ERROR', err); log(err) })));

        res.json((await makeQuery(req.body.request.adminOptions, scriptADDUSERPRIV(req.body.request.options.username))
            .then(res => { return res })
            .catch(err => { log('REJ ERROR', err); log(err) })));
    }
    else if ((req.body.request.data) && (req.body.request.tableName)) {

        // log('**apiDBadmin router.post / "data" ', req.body.request);
        // log(scriptGETDATA + req.body.request.tableName);
        res.json((await makeQuery(req.body.request.options, scriptGETDATA(100) + req.body.request.tableName)
            .then(res => { return res })
            .catch(err => { log('REJ ERROR', err); log(err) })));
    }
    else if (req.body.request.tableName) {

        // log('**apiDBadmin router.post / "table" ', req.body.request);
        // log(scriptGETFILDS + "'" + req.body.request.tableName + "'");
        res.json((await makeQuery(req.body.request.options, scriptGETFILDS + "'" + req.body.request.tableName + "'")
            .then(res => { return res })
            .catch(err => { log(err) })));
    }
    else if (req.body.request.db) {
        // log('**apiDBadmin router.post / "options" ', req.body.request);
        res.json((await makeQuery(req.body.request.options, scriptGETTABLES)
            .then(res => res)
            .catch(err => err.message)));
    };
});




// let query = (db, script) => {
//     return (new Promise((res, rej) => {
//         db.execute(script, (err, result) => {
//             if (err) rej(err);
//             res(result);
//         });
//     }));
// };


// let scriptGETSUM = "SELECT SUM(CH1) FROM COUNTERDATA";
// firebird.attach(options, (err, db) => {
//     try {
//         if (err) throw err
//         else {
//             query(db, scriptGETSUM)
//                 .then(res => log(res))
//                 .catch(err => log('makeQuery ERROR ------>', err.message))
//                 .finally(db.detach());
//         };
//     }
//     catch (err) { log('attachDB ERROR ------>', (err.message)) };
// });

//2 === 2 && alert() || gsdgsd

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


function makeResponse(inputObj) {
    let outputArr = [];
    for (let fields in inputObj) {
        outputArr.push(Object.entries(inputObj[fields]));
    };
    log('outputArr', outputArr);
    return outputArr;
};

let getID = (scriptCondition, arrCondition, field) => {
    for (let i = 0; i < arrCondition.length; i++) {
        if (i === (arrCondition.length - 1)) {
            scriptCondition += field + " = " + "'" + arrCondition[i].replace(/\s/g, "") + "'";
        }
        else scriptCondition += field + " = " + "'" + arrCondition[i].replace(/\s/g, "") + "'" + " OR ";
    };
    log(scriptCondition);
    return (scriptCondition);
}

let getIDdep = (scriptCondition, arrCondition, field) => {
    for (let i = 0; i < arrCondition.length; i++) {
        if (i === (arrCondition.length - 1)) {
            scriptCondition += field + " = " + "'" + arrCondition[i][0] + "'";
        }
        else scriptCondition += field + " = " + "'" + arrCondition[i][0] + "'" + " OR ";
    };
    log(scriptCondition);
    return (scriptCondition);
}

let getDEPDESCR = (scriptCondition, arrCondition, field) => {
    for (let i = 0; i < arrCondition.length; i++) {
        if (i === (arrCondition.length - 1)) {
            scriptCondition += field + " = " + "'" + arrCondition[i][0] + "'";
        }
        else scriptCondition += field + " = " + "'" + arrCondition[i][0] + "'" + " OR ";
    };
    log(scriptCondition);
    return (scriptCondition);
}
//----------------------------------------------------------------
let getTDEPARTMENTID = (scriptCondition, arrCondition, field) => {
    
    for (let i = 0; i < arrCondition.length; i++) {
        if (i === (arrCondition.length - 1)) {
            scriptCondition += field + " = " + "'" + arrCondition[i][0] + "'";
        }
        else scriptCondition += field + " = " + "'" + arrCondition[i][0] + "'" + " OR ";
    };
    log(scriptCondition);
    return (scriptCondition);

};

//--------------------------------------------------------
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