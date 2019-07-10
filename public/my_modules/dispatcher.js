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

    async _makeDataForPieChartQuery() {
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
                dates: [[
                    this._makeDateString(new Date(Date.parse(this.request.body.startDate))),
                    this._makeDateString(new Date(Date.parse(this.request.body.finishDate) + 86399999))
                ]],
                token: this.request.cookies.token,
                serials: serialArr
            };
        }
        catch (error) {
            log('ERROR in makeDataForPieChartQuery()', error);
        };
    };

    async _makeRequest() {
        log('this.request',this.request.body);
        log('await this._makeDataForPieChartQuery()',await this._makeDataForPieChartQuery());
    const firebirdRequester = new FirebirdRequester(await this._makeDataForPieChartQuery());
    firebirdRequester._scriptGetSUM();
};
};
module.exports = Dispatcher;