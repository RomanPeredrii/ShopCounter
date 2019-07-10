/* unit for obtaining request from font & call firebird or mongo methods */
log = console.log;

const MongoRequester = require('./mongoRequester.js');
const FirebirdRequester = require('./firebirdRequester.js');

class Dispatcher {
    constructor(_request) {
        this.request = _request;
    };

    _throwError(error) {
        throw error;
    };

    //!!! - make date string special for Firebird SQL script
    _makeDateString(dateVal) {
        return (`${dateVal.getUTCFullYear()}-${
            (dateVal.getUTCMonth() + 1)}-${
            dateVal.getUTCDate()} ${
            dateVal.getUTCHours()}:${
            dateVal.getUTCMinutes()}:${
            dateVal.getUTCSeconds()}`);
    };

    async makeDataForPieChartQuery() {
        try {
            const mongoRequester = new MongoRequester();
            //!!! - get list of counters serial number from MongoDb
            let countersArr = (await mongoRequester.getUserOptions(this.request.cookies.token)
                .then(options => options.counters)).split(';');
            // if (!countersArr) { log('USER WITHOUT COUNTERS'); this._throwError(); return null };
            countersArr.pop();
            let serialArr = [];
            let indexArr = [];
            //!!! - get indexes of required counters
            Object.keys(this.request.body).map((property) => {
                if ((property.substr(0, 7) === 'counter') && (typeof +property[7] === 'number'))
                    indexArr.push(+property.substring(7))
            });
            //!!! - make list [] of required counters serial number
            indexArr.map(index => serialArr.push(countersArr[index]));
            return {
                dateStart: this._makeDateString(new Date(Date.parse(this.request.body.startDate))),
                dateFinish: this._makeDateString(new Date(Date.parse(this.request.body.finishDate) + 86399999)),
                token: this.request.cookies.token,
                serials: countersArr
            };
        }
        catch (error) {
            log('ERROR in makeDataForPieChartQuery()', error);
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


    }
};
module.exports = Dispatcher;