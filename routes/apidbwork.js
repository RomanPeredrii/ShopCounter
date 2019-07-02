const log = console.log;
const firebird = require('node-firebird');
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
        if (!user) { log('USER NOT EXIST'); return null}
        return {
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
    } catch (err) { log('\n USER ERROR', err) };
};

// !! - the main router
router.post('/apidbwork', async (req, res) => {
    let userOptions = await getUserOptions(req.cookies.token);
    // !! - send start date of COUNTERDATA 
    if (req.body.startValue) {
        log('1 startValue = true');
        res.json((await makeQuery(userOptions, "SELECT MIN (TIMEPOINT) FROM COUNTERDATA")
            .then(res => { res.push(userOptions); return res })
            .catch(err => { log('REJ ERROR', err); log(err) })));
    }


    // // !! - send data according to user's request for bar chart (with sql injection defense)
    // else if ((req.body.request.timeStamp) && (req.body.request.barChat)) {
    //     log(2);
    //     let countersArr = userOptions.counters.split(';');
    //     countersArr.pop();
    //     let serialArr = [];
    //     req.body.request.serial.map((serial) => { serialArr.push(countersArr[serial]) })
    //     res.json(await selectionFromDBforBarChart(req.body.request.timeStamp, req.cookies.token, serialArr));
    // }


    // !! - send data according to user's request for pie chart (with sql injection defense)
    else if (req.body.pieChart) {
        log(`${3} pieChart=true`);
        let countersArr = userOptions.counters.split(';');
        countersArr.pop();
        let serialArr = [];
        let indexArr = [];

        Object.keys(req.body).map((prop) => {
            if ((prop.substr(0, 7) === 'counter') && (typeof +prop[7] === "number")) indexArr.push(+prop.substring(7))
        });
        indexArr.map((serial) => { serialArr.push(countersArr[serial]) });
        res.json(await selectionFromDBforPieChart(req.body.startDate, req.body.finishDate, req.cookies.token, serialArr));
    }

    // !! - send data according to user's request (with sql injection defense)
    // else if ((req.body.request.timeStamp) && (req.body.request.lineGraph)) {
    //     log(4);
    //     let countersArr = userOptions.counters.split(';');
    //     countersArr.pop();
    //     let serialArr = [];
    //     req.body.request.serial.map((serial) => { serialArr.push(countersArr[serial]) })
    //     res.json(await selectionFromDBforLineGraph(req.body.request.timeStamp, req.cookies.token, serialArr));
    // };
    // // ДУРКА!!!! ЯК ВОНА Є

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

// !! - make time stamps for requests to firebird according to clients request bar chart

let selectionFromDBforBarChart = async (timePoints, token, serials) => {

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

async function selectionFromDBforPieChart(startDate, finishDate, token, serials) {

    let TimeStamp = (timeStampS, timeStampF, periodChoice) => {
        return {
            timeStart: Date.parse(timeStampS.value),
            timeFinish: Date.parse(timeStampF.value),
            period: getChoicePeriod(periodChoice)
        };
    };





    let dateStart = new Date(Date.parse(startDate));
    let dateFinish = new Date(Date.parse(finishDate) + 86400000);
    log(dateStart, dateFinish);
    let arrRes = [];

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



let selectionFromDBforLineGraph = async (tPoints, token, serials) => {
    let rawData = [];
    for (let j = 0; j < serials.length; j++) {
        let timeStart = tPoints.timeStart;
        let timeFinish = tPoints.timeFinish;
        const period = tPoints.period;
        let dateStart = new Date(timeStart);
        let dateFinish = new Date(timeFinish + 86400000);
        let step = ((timeFinish + 86400000 - timeStart) / period);
        let serial = [serials[j]];
        let arrRes = [];
        for (let i = 0; i < step; i++) {
            timeFinish = timeStart + period;
            dateFinish = new Date(timeFinish);
            dateStart = new Date(timeStart);
            arrRes.push(await getDataFomDb(makeDateString(dateStart), makeDateString(dateFinish), await getUserOptions(token), serial).
                catch(err => log('CONNECTION TO DB ERROR ', err)));
            timeFinish = timeStart + period;
            timeStart += period;
        };
        rawData.push(arrRes);
    };
    log("rawData", rawData);
    return (rawData);
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
    // log((" SELECT SUM(CH1) FROM COUNTERDATA WHERE (CAST(TIMEPOINT AS TIMESTAMP) >= "
    //     + "'" + timePointS + "'" + ") AND (CAST(TIMEPOINT AS TIMESTAMP) <= "
    //     + "'" + timePointF + "'" + ") AND ( " + scriptCondition + " )"));
    return (" SELECT SUM(CH1) FROM COUNTERDATA WHERE (CAST(TIMEPOINT AS TIMESTAMP) >= "
        + "'" + timePointS + "'" + ") AND (CAST(TIMEPOINT AS TIMESTAMP) <= "
        + "'" + timePointF + "'" + ") AND ( " + scriptCondition + " )");
};


module.exports = router;