/* unit for make request to firebird */
log = console.log;


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

    _scriptGetSUM() {
        let timePointS = this.requestData.dates[0][0];
        let timePointF = this.requestData.dates[0][1];



        return (`SELECT SUM(CH1) FROM COUNTERDATA WHERE (CAST(TIMEPOINT AS TIMESTAMP) >='${
            timePointS}') AND (CAST(TIMEPOINT AS TIMESTAMP) <= '${
            timePointF}') AND (${this._serialsScriptCondition()})`);
    };




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