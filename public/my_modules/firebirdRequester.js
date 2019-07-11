/* unit for make request to firebird */
log = console.log;
const firebird = require('node-firebird');

class FirebirdRequester {
    constructor(requestData) {
        this.requestData = requestData;
    };

    _throwError(error) {
        throw error;
    };

    _serialsScriptCondition() {
        let serialsScriptCondition = '';
        this.requestData.serials.map((serial, i) => {
            const isLast = (i === (this.requestData.serials.length - 1));
            if (isLast) serialsScriptCondition += `SERIAL = '${serial}'`;
            else serialsScriptCondition += `SERIAL = '${serial}' OR `;
        });
        return serialsScriptCondition;
    }

    _scriptGetDataForPieChart() {
        let timePointS = this.requestData.dates[0];
        let timePointF = this.requestData.dates[1];

        // const g = ' ';
        // let S = `SELECT${
        //     g}EXTRACT(YEAR FROM TIMEPOINT) AS DE,${
        //     g}EXTRACT(MONTH FROM TIMEPOINT) AS DM,${
        //     g}EXTRACT(DAY FROM TIMEPOINT) AS DD,${
        //     g}EXTRACT(HOUR FROM TIMEPOINT) DH,${
        //     g}SUM(CH1) AS CNT${
        //     g}FROM${
        //     g}COUNTERDATA${
        //     g}WHERE${
        //     this._serialsScriptCondition()}) ${
        //     g}AND (CAST(TIMEPOINT AS TIMESTAMP) >= '${timePointS
        //     }') AND (CAST(TIMEPOINT AS TIMESTAMP) <= '${timePointF
        //     }') GROUP BY${
        //     g}DE, DM, DD DH`

        // log(this.requestData);
        // log(S);
        // return S;

        let s = (`SELECT SUM(CH1) AS CNT, SERIAL FROM COUNTERDATA WHERE ${this._serialsScriptCondition()} AND (CAST(TIMEPOINT AS TIMESTAMP) >='${timePointS
            }') AND (CAST(TIMEPOINT AS TIMESTAMP) <= '${timePointF}') GROUP BY SERIAL`);
        //log(this.requestData);
        //log(s);
        return s;

        //  return (`SELECT SUM(CH1) FROM COUNTERDATA WHERE (CAST(TIMEPOINT AS TIMESTAMP) >='${
        //      timePointS}') AND (CAST(TIMEPOINT AS TIMESTAMP) <= '${
        //      timePointF}') AND (${this._serialsScriptCondition()})`);
    };


    _query(db, script) {
        return (new Promise((res, rej) => {
            db.execute(script, (err, result) => {
                if (err) rej(err);
                res(result);
            });
        }));
    };

    _getAnswerFromDB() {
        return new Promise((res, rej) => {
            firebird.attach(this.requestData.options, async (err, db) => {
                try {
                    if (err) rej(err);
                    res(await this._query(db, this._scriptGetDataForPieChart()));
                }
                catch (err) { log('DB ERROR ------>', (err.message)) };
            });

        });
    };

    async _makeAnswer() {
        let rawAnswer = await this._getAnswerFromDB();
        rawAnswer.map((list, i) => rawAnswer[i].unshift(this.requestData.dates[0], this.requestData.dates[1]));

        return rawAnswer;

    }

    // _makeFantomAnswer() {
    //     let dateS = new Date(Date.parse(this.requestData.dates[0]));
    //     let dateF = new Date(Date.parse(this.requestData.dates[1]));

    //     log('dates', dateS, dateF);
    //     let fantom = [{ DE: 2019, DM: 1, DD: 31, DH: 10, CNT: 0 }];        
    // }


    //     // !! - make response array
    //     for (let i = 0; i < serials.length; i++) {
    //         let serial = [serials[i]];
    //         let rawData = (await getDataFomDb(makeDateString(dateStart), makeDateString(dateFinish), await getUserOptions(token), serial).
    //             catch(err => log('CONNECTION TO DB ERROR ', err)));
    //         rawData.push(serials[i]);
    //         arrRes.push(rawData);
    //         // log("arrRes->>", arrRes);
    //     };
    //     log("arrRes", arrRes);
    //     return (arrRes);
    // };


    // // !! - getDataFomDb according to client conditions from request body
    // async function getDataFomDb(timePointSart, timePointFinish, accessOptions, serials) {
    //     //log('accessOptions', serials);
    //     return new Promise((res, rej) => {
    //         firebird.attach(accessOptions, async (err, db) => {
    //             if (err) { log(err); rej(err) }
    //             else {
    //                 let arr = [timePointSart, timePointFinish];
    //                 arr.push(await queryToDB(scriptGetSUM(timePointSart, timePointFinish, serials), db)
    //                     .catch(err => log('SQL SCRIPT ERROR!', err)));
    //                 res(arr);
    //             };
    //         });
    //     });
    // };

    // res.json(await selectionFromDBforPieChart(req.body.startDate, req.body.finishDate, req.cookies.token, serialArr));



};
module.exports = FirebirdRequester;