/* unit for obtaining request from font & call firebird or mongo methods */
const log = require('./stuffBE.js').log;
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

    async _makeDataForGetStartQuery() {
        try {
            const mongoRequester = new MongoRequester();
            //!!! - get user options for attach FirebirdDB fom MongoDb
            return { options: await mongoRequester.getUserOptions(this.request.cookies.token) }
        }
        catch (error) {
            log('dispatcher ERROR in _makeDataForGetStartQuery()', error);
        };
    };

    async _makeDataForPieChartQuery() {
        try {
            const mongoRequester = new MongoRequester();
            //!!! - get list of counters serial number from MongoDb
            let countersArr = (await mongoRequester.getUserOptions(this.request.cookies.token)
                .then(options => options.counters)).split(';');
            countersArr.pop();
            //!!! - get list of departments serial number from MongoDb
            let departmentsArr = (await mongoRequester.getUserOptions(this.request.cookies.token)
                .then(options => options.department)).split(';');
            departmentsArr.pop();
            let serialArr = [];
            let indexArr = [];
            let departments = [];
            //!!! - get indexes of required counters
            Object.keys(this.request.body).map((property) => {
                if ((property.substr(0, 7) === 'counter') && (typeof +property[7] === 'number'))
                    indexArr.push(+property.substring(7));

            });
            //!!! - make list [] of required counters serial number
            indexArr.map((index, i) => {
                serialArr.push(countersArr[index]);
                departments.push(departmentsArr[index]);
            });

            return {
                dates: [
                    this._makeDateString(new Date(Date.parse(this.request.body.startDate))),
                    this._makeDateString(new Date(Date.parse(this.request.body.finishDate) + 86399999))
                ],
                options: await mongoRequester.getUserOptions(this.request.cookies.token),
                serials: serialArr,
                departments: departments,
                period: this.request.body.period
            };
        }
        catch (error) {
            log('dispatcher ERROR in _makeDataForPieChartQuery()', error);
        };
    };

    async _makeDataForBarChartQuery() {
        try {
            const mongoRequester = new MongoRequester();
            //!!! - get list of counters serial number from MongoDb
            let countersArr = (await mongoRequester.getUserOptions(this.request.cookies.token)
                .then(options => options.counters)).split(';');
            countersArr.pop();
            //!!! - get list of departments serial number from MongoDb
            let departmentsArr = (await mongoRequester.getUserOptions(this.request.cookies.token)
                .then(options => options.department)).split(';');
            departmentsArr.pop();
            let serialArr = [];
            let indexArr = [];
            let departments = [];
            //!!! - get indexes of required counters
            Object.keys(this.request.body).map((property) => {
                if ((property.substr(0, 7) === 'counter') && (typeof +property[7] === 'number'))
                    indexArr.push(+property.substring(7));

            });
            //!!! - make list [] of required counters serial number
            indexArr.map((index, i) => {
                serialArr.push(countersArr[index]);
                departments.push(departmentsArr[index]);
            });

            return {
                dates: [
                    this._makeDateString(new Date(Date.parse(this.request.body.startDate))),
                    this._makeDateString(new Date(Date.parse(this.request.body.finishDate) + 86399999))
                ],
                period: this.request.body.period,
                options: await mongoRequester.getUserOptions(this.request.cookies.token),
                serials: serialArr,
                departments: departments
            };
        }
        catch (error) {
            log('dispatcher ERROR in _makeDataForBarCartQuery()', error);
        };
    };

    async makeRequestForGetStartData() {
        const firebirdRequester = new FirebirdRequester(await this._makeDataForGetStartQuery());
        return await firebirdRequester.makeAnswerForGetStartData();
    };

    async makeRequestForPieChart() {
        const firebirdRequester = new FirebirdRequester(await this._makeDataForPieChartQuery());
        return await firebirdRequester.makeAnswerForPieChart();
    };

    async makeRequestForBarChart() {
        const firebirdRequester = new FirebirdRequester(await this._makeDataForPieChartQuery());
        log(await firebirdRequester.makeAnswerForBarChart())
        return await firebirdRequester.makeAnswerForBarChart();
    };

};
module.exports = Dispatcher;