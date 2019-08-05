/* unit for make request to firebird */

/* income Obj {
 dates: [ 'startDate', 'finishDate' ],                              // dates of user request:"yyyy-M-d H:m:s"
  options:                                                          //optoins for attach FirebirdDB: object { String }
   { host: 'xxxxxxxxxxxxxx',
     port: 'XXXX',
     database: 'XXXXXXXXXXXXX',
     user: 'xxxxxxx',
     password: 'xxxxxxx',
     pageSize: 'XXXXXX',
     role: 'xxxxxx',
     counters: 'XXXX;XXXX;...;XXXX;',                               //list of serial numbers available for this user counters: String
     department: 'xxxxxxxxxxxxxxxxx;..;xxxxxxxxxxxxxxxxxxxxx;,      //description of departments according to serial numbers: String
     products: 'xxxxxxxx',..,'xxxxxx'},                             //description of products usually city or brand: String 
  serials: [XXXX;XXXX;...;XXXX],                                    //list of serial numbers for current user's request Array ['String']
  departments: [ 'xxxxxxxxxxx','xxxxxxxxxxxx',..,'xxxx'],           //list of of departments according current user's request for add to request
  period: 'month'                                                   //period for selection data
}*/


const log = require('./stuffBE.js').log;
const firebird = require('node-firebird');
const makeRandomColor = require('./stuffBE.js').makeRandomColor;
require('datejs');

class FirebirdRequester {
    constructor(requestData) {
        this.requestData = requestData;
    };

    //!!! - make date string special for Firebird SQL script
    _makeDateString(dateVal) {
        return (`${dateVal.getUTCFullYear()}-${
                dateVal.getUTCMonth()}-${
                dateVal.getUTCDate()} ${
                dateVal.getUTCHours()}:${
                dateVal.getUTCMinutes()}:${
                dateVal.getUTCSeconds()}`);
    };

    _throwError(error) {
        throw error;
    };

    _queryArr(db, script) {
        return (new Promise((res, rej) => {
            db.execute(script, (err, result) => {
                if (err) rej(err);
                if (!result[0][0]) result = [
                    [0]
                ];
                res(result);

            });

        }));
    };

    _queryObj(db, script) {
        return (new Promise((res, rej) => {
            db.query(script, (err, result) => {
                if (err) rej(err);
                res(result);
            });
        }));
    };

    // !! - getDataFomDb according to client conditions
    _getAnswerFromDB(script, func) {
        return new Promise((res, rej) => {
            firebird.attach(this.requestData.options, async(err, db) => {
                try {
                    if (err) rej(err);
                    //res(await this._query(db, script))
                    res(await func(db, script))
                    db.detach();
                } catch (err) { log('DB ERROR ------>', (err.message)) };
            });
        });
    };

    //!! script for getting first date of DB items
    _scriptGetMinDate() {
        return "SELECT MIN (TIMEPOINT) FROM COUNTERDATA";
    };
    // !! - get SUMs for pieChart according to request condition
    _scriptGetDataForPieChart() {
        let timePointS = this.requestData.dates[0];
        let timePointF = this.requestData.dates[1];
        return (`SELECT SUM(CH1), SERIAL FROM COUNTERDATA WHERE SERIAL IN (${this.requestData.serials.join(', ')
            }) AND (CAST(TIMEPOINT AS TIMESTAMP) >='${
            timePointS}') AND (CAST(TIMEPOINT AS TIMESTAMP) <= '${
            timePointF}') GROUP BY SERIAL`);
    };

    // !! - get SUMs for barChart according to request condition
    _scriptGetDataForBarChart([timePointS, timePointF]) {
        return (`SELECT SUM(CH1) FROM COUNTERDATA WHERE SERIAL IN (${
            this.requestData.serials.join(', ')
            }) AND CAST(TIMEPOINT AS TIMESTAMP) >= '${
            timePointS}' AND CAST(TIMEPOINT AS TIMESTAMP) <= '${
            timePointF}'`);
    };


    // !! - get list of DEPARTMENTS
    _scriptGetDataForGetSerialsProductsDepartment() {
        const g = ' ';
        return (`SELECT${
    g}COUNTERDATA.SERIAL, PRODUCTS.PRODDESCR, DEPARTMENT.DEPDESCR${
    g}FROM COUNTERDATA${
    g}JOIN COUNTERLIST ON COUNTERLIST.SERIAL = COUNTERDATA.SERIAL${
    g}JOIN PRODUCTS ON COUNTERLIST.PRODID = PRODUCTS.PRODID${
    g}JOIN DEPARTMENT ON COUNTERLIST.DEPID = DEPARTMENT.DEPID${
    g}GROUP BY PRODUCTS.PRODDESCR, COUNTERDATA.SERIAL, DEPARTMENT.DEPDESCR`);
    };

    //!! all add... just increase base date for next period
    //!! make period of selection from DB according to user answer
    _period(date, period) {
        let _date = new Date.parse(date);
        switch (period) {
            case 'hour':
                return {
                    date: [
                        _date.toString("yyyy-M-d H:m:s"),
                        _date.toString("yyyy-M-d H:m:s"),
                    ],
                    add(date) {
                        let _date = new Date.parse(date);
                        return _date.addHours(1)
                    },
                    legend(date) {
                        return Date.parse(date).toString("yyyy-M-d H:mm")
                    }
                };
            case 'day':
                return {
                    date: [
                        _date.toString("yyyy-M-d H:m:s"),
                        _date.addDays(1).toString("yyyy-M-d H:m:s"),
                    ],
                    add(date) {
                        let _date = new Date.parse(date);
                        return _date.addDays(1)
                    },
                    legend(date) {
                        return Date.parse(date).toString("yyyy-M-d ddd")
                    }
                };
            case 'week':
                return {
                    date: [
                        _date.last().monday().toString("yyyy-M-d"),
                        _date.next().sunday().toString("yyyy-M-d"),
                    ],
                    add(date) {
                        let _date = new Date.parse(date);
                        return _date.addWeeks(1)
                    },
                    legend(date) {
                        return `${Date.parse(date).
                        toString('yyyy-W')} (${
                            _date.last().monday().toString('MMM.d')} - ${
                                _date.next().sunday().toString('MMM.d')})`
                    }
                };
            case 'month':
                return {
                    date: [
                        _date.set({ day: 1 }).toString("yyyy-M-d"),
                        _date.next().month().set({ day: 1 }).addDays(-1).toString("yyyy-M-d"),
                    ],
                    add(date) {
                        let _date = new Date.parse(date);
                        return _date.addMonths(1)
                    },
                    legend(date) {
                        return Date.parse(date).toString("yyyy-MMM")
                    }
                };
            case 'year':
                return {
                    // date: [
                    //     _date.set({ day: 1 }).toString("yyyy-M-d"),
                    //     _date.next().month().set({ day: 1 }).addDays(-1).toString("yyyy-M-d"),
                    // ],
                    date: [
                        _date.january().set({ day: 1 }).toString("yyyy-M-d"),
                        _date.december().set({ day: 31 }).toString("yyyy-M-d"),
                    ],

                    add(date) {
                        let _date = new Date.parse(date);
                        //return _date.addMonths(1)
                        return _date.addYears(1)
                    },
                    legend(date) {
                        return Date.parse(date).toString("yyyy-MM")
                    }
                };
        };
    };

    //!! all makeAnswer.... just generalize data 
    async makeAnswerForGetStartData() {
        let rawAnswer = await this._getAnswerFromDB(this._scriptGetMinDate(), this._queryArr);
        rawAnswer.push(this.requestData.options.department);
        return rawAnswer
    };

    async makeAnswerForPieChart() {
        let rawAnswer = await this._getAnswerFromDB(this._scriptGetDataForPieChart(), this._queryArr);
        rawAnswer.map((list, i) => {
            rawAnswer[i].unshift(this.requestData.departments[i]);
            rawAnswer[i].push(makeRandomColor());
        });
        return rawAnswer;
    }

    async makeAnswerForBarChart() {
        let from = Date.parse(this.requestData.dates[0]);
        let rawAnswer = [];
        do {
            let result = await this._getAnswerFromDB(this._scriptGetDataForBarChart(this._period(from, this.requestData.period).date), this._queryArr);
            result[0].push(this._period(from, this.requestData.period).legend(from));
            result[0].push(this.requestData.departments.join());
            rawAnswer.push(result[0]);
            from = this._period(from, this.requestData.period).add(from);
        }
        while (from <= Date.parse(this.requestData.dates[1]));
        return rawAnswer;
    };

    async makeAnswerForLineGraph() {};

    async makeAnswerForGetSerialsProductsDepartment() {
        let serialsList = {};
        let result = await this._getAnswerFromDB(this._scriptGetDataForGetSerialsProductsDepartment(), this._queryObj);
        result.forEach(i => serialsList[i.SERIAL.trim()] = `${i.PRODDESCR}, ${i.DEPDESCR}`);
        return serialsList;
    };

};
module.exports = FirebirdRequester;

/* output Array [different items depends on request] */