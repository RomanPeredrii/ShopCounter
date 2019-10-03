const log = require('./stuff.js').log;
const firebird = require('node-firebird');
const router = require('express').Router();
const User = require('../models/user.js');
const Dispatcher = require('./dispatcher.js');

router.post('/apidbadmin', async(req, res, next) => {
    /// !! - get products & department
    // log('/apidbadmin', req.body)
    if (req.body.getDepProd) {
        log('getDepProd', req.body);
        // log('newUser', req.body.newUser);
        const dispatcher = new Dispatcher(req);

        res.json(await dispatcher.makeRequestForGetSerialsProductsDepartment());

        // let arrDEPID = (await makeQuery(req.body.request.adminOptions, scriptGETDEPARTMENTID(req.body.request.department, 'DEPDESCR'))
        //     .then(res => { return res })
        //     .catch(err => {
        //         log('REJ ERROR', err);
        //         log(err)
        //     }));
        // } else if (req.body.getRoles) {
        //     const dispatcher = new Dispatcher(req);
        //     res.json(await dispatcher.makeRequestForGetRoles());
    } else if (req.body.newUser) {
        log('!!newUser', req.body.newUser);
        //  log('getDepProd', req.body.getDepProd);

        const dispatcher = new Dispatcher(req);
        res.json(await dispatcher.makeRequestForAddUser());


    } else if (req.body.delUser) {
        log('!!delUser', req.body.delUser);
        const dispatcher = new Dispatcher(req);
        let result = (await dispatcher.makeRequestForDelUser())
        log('res', result);
        res.json(result);
    }
});



// const response = {
//     ok: 'here',
//     admin: false,
//     error: false,
//     logged: true,
//     connected: false
// };


// !! - set of scripts to firebird below (see name)
// const scriptGETTABLES = " SELECT RDB$RELATION_NAME FROM RDB$RELATIONS WHERE (RDB$RELATION_TYPE = 0) AND (RDB$SYSTEM_FLAG IS DISTINCT FROM 1)";
// const scriptGETFILDS = "SELECT RDB$FIELD_NAME FROM RDB$RELATION_FIELDS WHERE RDB$SYSTEM_FLAG = 0 AND RDB$RELATION_NAME = ";
// let scriptGETDATA = (count) => { return ("SELECT FIRST " + count + " * FROM ") };
// let scriptADDUSER = (user, password) => { return ("CREATE USER " + user + " PASSWORD " + "'" + password + "'") };
// let scriptADDUSERPRIV = (user) => { return (" GRANT SELECT ON TABLE COUNTERDATA TO USER " + user) };
// let scriptGETCOUNT = (table) => { return ("SELECT COUNT(*) FROM " + table) };
// let scriptGETPRODUCTS = (table) => { return ("SELECT DISTINCT PRODDESCR FROM " + table) };

// let scriptGETPRODID = (condition, field) => {
//     let arrID = condition.split(',');
//     arrID.pop();
//     let scriptCondition = getID("SELECT PRODID FROM PRODUCTS WHERE ", arrID, field)
//     return (scriptCondition);
// };
// let scriptGETDEPID = (condition, field) => {
//     let scriptCondition = getTDEPARTMENTID("SELECT DEPID FROM COUNTERLIST WHERE ", condition, field)
//     return (scriptCondition);
// };

// let scriptGETPRODUCTSID = (condition, field) => {
//     let scriptCondition = getTDEPARTMENTID("SELECT PRODID FROM COUNTERLIST WHERE ", condition, field)
//     return (scriptCondition);
// };
// let scriptGETDEPDESCR = (condition, field) => {
//     let scriptCondition = getDEPDESCR("SELECT DEPDESCR FROM DEPARTMENT WHERE ", condition, field)
//     return (scriptCondition);
// };

// let scriptGETDEPARTMENTID = (condition, field) => {
//     let arrID = condition.split(';');
//     arrID.pop();
//     let scriptCondition = getTDEPARTMENTID("SELECT DEPID FROM DEPARTMENT WHERE ", arrID, field)
//     return (scriptCondition);
// };

// let scriptGETSERIAL = (conditionDEP, fieldDEP, conditionPROD, fieldPROD) => {
//     let scriptCondition = getDEPDESCR("SELECT SERIAL FROM COUNTERLIST WHERE (", conditionDEP, fieldDEP) + ") AND " + getDEPDESCR("(", conditionPROD, fieldPROD) + ")";
//     return (scriptCondition);
// };

// router.post('/apidbadmin', async(req, res, next) => {

//     // !! - get department
//     if ((req.body.request.department) && (req.body.request.tableName === 'DEPARTMENT')) {
//         log(1);
//         let arrDEPID = (await makeQuery(req.body.request.adminOptions, scriptGETDEPARTMENTID(req.body.request.department, 'DEPDESCR'))
//             .then(res => { return res })
//             .catch(err => {
//                 log('REJ ERROR', err);
//                 log(err)
//             }));

//         let arrPRODID = (await makeQuery(req.body.request.adminOptions, scriptGETPRODUCTSID(arrDEPID, 'DEPID'))
//             .then(res => { return res })
//             .catch(err => {
//                 log('REJ ERROR', err);
//                 log(err)
//             }));

//         res.json((await makeQuery(req.body.request.adminOptions, scriptGETSERIAL(arrDEPID, 'DEPID', arrPRODID, 'PRODID'))
//             .then(res => { return res })
//             .catch(err => {
//                 log('REJ ERROR', err);
//                 log(err)
//             })));

//     }

// !! - get serials of department list
// else if ((req.body.request.products) && (req.body.request.tableName === 'COUNTERLIST')) {
//     log(2);
//     let arrPRODID = (await makeQuery(req.body.request.adminOptions, scriptGETPRODID(req.body.request.products, 'PRODDESCR'))
//         .then(res => { return res })
//         .catch(err => {
//             log('REJ ERROR', err);
//             log(err)
//         }));

//     let arrDEPID = (await makeQuery(req.body.request.adminOptions, scriptGETDEPID(arrPRODID, 'PRODID'))
//         .then(res => { return res })
//         .catch(err => {
//             log('REJ ERROR', err);
//             log(err)
//         }));

//     res.json((await makeQuery(req.body.request.adminOptions, scriptGETDEPDESCR(arrDEPID, 'DEPID'))
//         .then(res => { return res })
//         .catch(err => {
//             log('REJ ERROR', err);
//             log(err)
//         })));
// }

// !! - get products
// else if (req.body.request.products) {
//     log(3);
//     res.json((await makeQuery(req.body.request.adminOptions, scriptGETPRODUCTS(req.body.request.tableName))
//         .then(res => { return res })
//         .catch(err => {
//             log('REJ ERROR', err);
//             log(err)
//         })));
// }

// else if (req.body.request.tableField) {
//     log('**apiDBadmin router.post / "makeReqGetMaxCount" ', req.body.request.tableField);
//     res.json((await makeQuery(req.body.request.adminOptions, scriptGETCOUNT(req.body.request.tableName))
//         .then(res => { log(res); return res })
//         .catch(err => { log('REJ ERROR', err); log(err) })));
// }


// !! - add new user 
// else if (req.body.request.addUser) {
//     log(4);
//     res.json((await makeQuery(req.body.request.adminOptions, scriptADDUSER(req.body.request.options.username, req.body.request.options.password))
//         .then(res => { return res })
//         .catch(err => {
//             log('REJ ERROR', err);
//             log(err)
//         })));

//     res.json((await makeQuery(req.body.request.adminOptions, scriptADDUSERPRIV(req.body.request.options.username))
//         .then(res => { return res })
//         .catch(err => {
//             log('REJ ERROR', err);
//             log(err)
//         })));
// }

// !! - get strings from COUNTERDATA according to count (double slider fo choice count doesn't use now (default 100))
// else if ((req.body.request.data) && (req.body.request.tableName)) {
//     log(5);
//     res.json((await makeQuery(req.body.request.options, scriptGETDATA(100) + req.body.request.tableName)
//         .then(res => { return res })
//         .catch(err => {
//             log('REJ ERROR', err);
//             log(err)
//         })));
// }

// !! - get fields of table
// else if (req.body.request.tableName) {
//     log(6);
//     res.json((await makeQuery(req.body.request.options, scriptGETFILDS + "'" + req.body.request.tableName + "'")
//         .then(res => { return res })
//         .catch(err => { log(err) })));
// }

// !! - get tables of db
//     else if (req.body.request.db) {
//         log(7);
//         res.json((await makeQuery(req.body.request.options, scriptGETTABLES)
//             .then(res => res)
//             .catch(err => err.message)));
//     };
// });


// !! - make request to firebird
// async function makeQuery(options, script) {
//     return new Promise((res, rej) => {
//         /*??????*/
//         try {
//             firebird.attach(options, async(err, db) => {
//                 if (err) {
//                     log('ERR', err);
//                     rej(err)
//                 } else {
//                     //log('---------->', script);
//                     var resQ = new Promise((res, rej) => {
//                         db.execute(script, (err, result) => {
//                             if (err) rej(err);
//                             res(result);
//                         });
//                     });
//                     res(await resQ.then(res => {
//                             /*log('res---------->', res);*/
//                             return res
//                         }).catch(err => { log('REJ ERROR', err) })
//                         .finally(db.detach()));
//                 };
//             });
//         } catch (err) {
//             ('makeQuery ERROR', log(err))
//         };
//     });
// };

// !! - convert response object to arr (doesn't use now)
// function makeResponse(inputObj) {
//     let outputArr = [];
//     for (let fields in inputObj) {
//         outputArr.push(Object.entries(inputObj[fields]));
//     };
//     log('outputArr', outputArr);
//     return outputArr;
// };

// !! - forming string for script (see name) 
// let getID = (scriptCondition, arrCondition, field) => {
//     for (let i = 0; i < arrCondition.length; i++) {
//         if (i === (arrCondition.length - 1)) {
//             scriptCondition += field + " = " + "'" + arrCondition[i].replace(/\s/g, "") + "'";
//         } else scriptCondition += field + " = " + "'" + arrCondition[i].replace(/\s/g, "") + "'" + " OR ";
//     };

//     return (scriptCondition);
// }

// let getDEPDESCR = (scriptCondition, arrCondition, field) => {
//     for (let i = 0; i < arrCondition.length; i++) {
//         if (i === (arrCondition.length - 1)) {
//             scriptCondition += field + " = " + "'" + arrCondition[i][0] + "'";
//         } else scriptCondition += field + " = " + "'" + arrCondition[i][0] + "'" + " OR ";
//     };
//     return (scriptCondition);
// }

// let getTDEPARTMENTID = (scriptCondition, arrCondition, field) => {
//     for (let i = 0; i < arrCondition.length; i++) {
//         if (i === (arrCondition.length - 1)) {
//             scriptCondition += field + " = " + "'" + arrCondition[i] + "'";
//         } else scriptCondition += field + " = " + "'" + arrCondition[i] + "'" + " OR ";
//     };
//     return (scriptCondition);
// };


module.exports = router;