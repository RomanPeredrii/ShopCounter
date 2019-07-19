
// !!! - coments
import Request from '../my_modules/request.js';
import Gather from '../my_modules/gather.js';
import { log, dqs, dqsA } from '../my_modules/stuff.js';
const divSendReq = document.querySelector('.divSendReq');
const timeStampS = document.querySelector('#timeStampS');
const timeStampF = document.querySelector('#timeStampF');
const dataTable = document.querySelector('#dataFromDB > tbody');
const divPeriodSet = document.querySelector('#periodSet');
const forDateChoise = document.querySelector('.forDateChoise');
let request;
//!!! just for locking default revalues
const defaultRequest = () => {
    return {
        startValue: false,
        timeStamp: false,
        serial: false,
        period: false
    };
};

let gather = new Gather('.left', defaultRequest()); // have to be deleted!!!!!!!!!!!!!!!!



//!!! just for locking default values
let defRequest = () => {
    return request = {
        startValue: false,
        timeStamp: false,
        serial: false,
        pieChart: false,
        lineGraph: false,
        barChat: false
    };
};

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};


// !!! - getCheckedDepartments method for specification user`s request according to department 
// WILL BE DELETED!!!!!
let getCheckedDepartments = () => {
    let serialsArrNumber = [];
    let serials = document.querySelectorAll('.counters>input');
    serials.forEach((serial, i) => {
        if (serial.checked) serialsArrNumber.push(i);
    });
    return serialsArrNumber;
}; //WILL BE REMOVED!!!!!

// !!! - creating&rendering checkbox for choice of department according to data from mongo
const showCountersList = (data, parent) => {
    const counters = document.querySelector(parent);
    let departmentArr = data[1].split(';')
    departmentArr.pop();
    departmentArr.map((department, i) => {
        let check = document.createElement('input');
        check.type = "checkbox";
        check.value = department;
        check.name = `counter${i}`;
        counters.appendChild(check);
        counters.innerHTML += `<label for=${check}>${department}</label><br>`
    });
};
// !!! - set default dates
const setDefaultDates = (date) => {
    // !! - forming start date string
    let dateTimeS = new Date(Date.parse(date));
    timeStampS.value = dateTimeS.getFullYear() + '-'
        + (dateTimeS.getMonth() < 10
            ? ('0' + (dateTimeS.getMonth() + 1))
            : (dateTimeS.getMonth() + 1))
        + '-'
        + (dateTimeS.getDate() < 10
            ? ('0' + dateTimeS.getDate())
            : (dateTimeS.getDate()));
    // !! - forming finish date string
    let dateTimeF = new Date();
    timeStampF.value = dateTimeF.getFullYear() + '-'
        + (dateTimeF.getMonth() < 10
            ? ('0' + (dateTimeF.getMonth() + 1))
            : (dateTimeF.getMonth() + 1))
        + '-'
        + (dateTimeF.getDate() < 10
            ? ('0' + dateTimeF.getDate())
            : (dateTimeF.getDate()));
};
// !!! - rendering radio for choice period for user`s request to firebird
const setPeriod = (from, to) => {
    let period = ["hour", "day", "week", "month"];
    //let periodMs = [3600000, 86400000, 604800000, 2678400000];
    let inputs = '';
    for (let i = from; i <= to; i++) {
        inputs += `
            <div class="periodSet">
            <input id="period${period[i]}" type="radio" name="period" value= ${period[i]} />
            <label for="period${period[i]}"> ${period[i]} </label>
            </div>
         `};
    divPeriodSet.innerHTML = inputs;
};

// !! - weekend must get red color
const setColourOfWeekend = (date, period) => {
    date = new Date(Date.parse(date));
    if ((period === "day") && ((date.getDay() === 0) || (date.getDay() === 6)))
        return '#e46464';
};

// !!! - make different colors numbers
const makeRandomColor = () => {
    let text = "";
    let possible = "ABCDEF0123456789";
    for (let i = 0; i < 6; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    };
    return `#${text}`;
};

// !!! - make first request for getting user object from mongo & start date from firebird 
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const gather = new Gather('.left', defaultRequest());
        gather.getCheckedValues().startValue = true;
        const request = new Request();
        const result = await request.makeRequest('/api/apidbwork', gather.getCheckedValues());
        //!!! - create list of counters
        showCountersList(result, '.counters');
        // !!! - filing start date from firebird
        if (result.unlogged) window.location.replace('/')
        else if (result) {
            setDefaultDates(result[0][0]);
        };
    } catch (err) { log('counters list', err) };
});




// !! - check&create period above
function periodValidator() {
    const month = 2678400000;
    const week = 604800000;
    let period = timeStampF.valueAsDate - timeStampS.valueAsDate;
    if (period > month) setPeriod(1, 3);
    if (period < month) setPeriod(1, 2);
    if (period < week) setPeriod(0, 1);


    // !! - check start finish dates 
    if (timeStampS.value >= timeStampF.value) {
        timeStampS.value = timeStampF.value;
        setPeriod(0, 1);
    };
};

forDateChoise.addEventListener('click', () => divSendReq.style.display = 'none');
divPeriodSet.addEventListener('click', () => divSendReq.style.display = 'inline-block');
forDateChoise.addEventListener('change', periodValidator);
forDateChoise.addEventListener('click', periodValidator);


// // // // // // // // // // // // // // // // // // // // // // // // // 
// MUST BE MOVED ON BACK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// !! - get chosen period for user`s request to firebird
function getChoicePeriod(periodCheck) {
    for (let period of periodCheck) {
        if (period.checked) return period.value;
    };
};
// // // // // // // // // // // // // // // // // // // // // // // // // 


// !! - forming date string for datatable 
function makeDateForPerfomance(dateTime, period) {
    dateTime = new Date(Date.parse(dateTime));
    return (period === hour
        ? (dateTime.getFullYear() + '-' + (dateTime.getMonth() + 1) + '-' +
            dateTime.getDate() + ' ' + dateTime.getHours() + ':' + dateTime.getMinutes() + '0')
        : (dateTime.getFullYear() + '-' + (dateTime.getMonth() + 1) + '-' +
            dateTime.getDate()));
};







// !! - wrapping for fetch
let makeReq = async (request) => {
    try {
        const rawResponse = await fetch('/api/apidbwork', {
            method: 'POST',
            headers,
            body: JSON.stringify({ request })
        });
        const result = await rawResponse.json();
        return result;
    }
    catch (err) { 'fetch ERROR', log(err) };
};

// !! - creating table for rendering requested data from firebird
let makeTable = (parent, dataArr, period) => {
    parent.innerHTML = '';
    dataArr.map((rowResult, i) => {
        const tr = document.createElement('tr');
        const td0 = document.createElement('td');
        const td1 = document.createElement('td');
        td0.textContent = rowResult[1];
        td1.textContent = rowResult[0];
        [td0, td1].map(td => tr.appendChild(td));
        tr.style.background = setColourOfWeekend(rowResult[0], getChoicePeriod(period));
        parent.appendChild(tr);
    });
};

// !! - pie chart
const builtPieChat = async () => {
    if (getCheckedDepartments().length === 0) alert("CHOICE SOME DEPARTMENT")
    else {
        const periodChoice = document.querySelectorAll('#periodSet > .periodSet > input');
        if (!getChoicePeriod(periodChoice)) periodChoice[0].checked = true;  // захист від дурнів
        else {
            try {
                const gather = new Gather('.left', defaultRequest());
                gather.getCheckedValues().type = 'pieChart';
                const request = new Request();
                log('request', gather.getCheckedValues());
                const result = await request.makeRequest('/api/apidbwork', gather.getCheckedValues());
                log('result', result);
                // !! - checking session
                if (result.unlogged) {
                    log('RESULT:', result);
                    window.location.replace('/');
                }
                else if (result) {
                    dataTable.style.display = 'block';
                    makeTable(dataTable, result, periodChoice);

                    bildChart(result.map(arr => arr[1]),
                        result.map(arr => arr[0]),
                        result.map(arr => arr[3]), 'pie', true);
                } else throw err;
            }
            catch (err) { log(err) };
        };
        dqs('.guide').style.display = 'none';
    };
};

// !! - bar chart
let builtBarChat = async () => {
    if (getCheckedDepartments().length === 0) alert("CHOICE SOME DEPARTMENT")
    else {
        const periodChoice = document.querySelectorAll('#periodSet > .periodSet > input');
        if (!getChoicePeriod(periodChoice)) periodChoice[0].checked = true;  // захист від дурнів
        else {
            try {
                const gather = new Gather('.left', defaultRequest());
                gather.getCheckedValues().type = 'barChat';
                const request = new Request();
                log('request', gather.getCheckedValues());
                const result = await request.makeRequest('/api/apidbwork', gather.getCheckedValues());
                log('RESULT:', result);
                // !! - checking session
                if (result.unlogged) {
                    window.location.replace('/');
                }
                else if (result) {
                    //log('RESULT:', result);
                    dataTable.style.display = 'block';
                    makeTable(dataTable, result, periodChoice);

                    // !!! necessary to add useful labels & legends

                    bildChart(result.map(arr => arr[0]), result.map(arr => arr[1]), '#5c745f', 'bar', false);
                } else throw err;
            }
            catch (err) { log(err) };
        };
        document.querySelector('.guide').style.display = 'none';
        // const typeOfChart = document.querySelector('.typeOfChart');
        // typeOfChart.style.display = 'block';
    };
};
//===============================================================================
//!!! WILL BE CUT OFF
// !! - make main request for getting data from firebird according to user`s conditions
//reqButton.addEventListener('click', builtBarChat);
//================================================================================




// !! - line graph
let builtLineGraph = async () => {
    log(gather.getCheckedValues())
    if (getCheckedDepartments().length === 0) alert("CHOICE SOME DEPARTMENT")
    else {
        const periodChoice = document.querySelectorAll('#periodSet > .periodSet > input');
        if (!getChoicePeriod(periodChoice)) periodChoice[0].checked = true;  // захист від дурнів
        else {
            try {
                let request = defRequest();
                request.lineGraph = true;
                request.timeStamp = TimeStamp(timeStampS, timeStampF, periodChoice);
                request.serial = getCheckedDepartments();
                // log(request);
                const result = await makeReq(request);

                // !! - checking session
                if (result.unlogged) {
                    //log('RESULT:', result);
                    window.location.replace('/');
                }
                else if (result) {
                    //log('RESULT:', result);
                    dataTable.style.display = 'none';

                    // !!! necessary to add useful labels & legends
                    let dataArr = (result) => {
                        let retDataArr = [];
                        for (let i = 0; i < result.length; i++) {
                            // log(result[i]);
                            let color = makeRandomColor();
                            retDataArr.push({
                                label: dataFromDB,
                                data: result[i],
                                fill: false,
                                backgroundColor: color,
                                borderColor: color,
                                borderWidth: 2
                            });
                        };
                        return retDataArr;
                    };

                    let labelArr = (result) => {
                        let retLabelArr = [];
                        for (let i = 0; i < result.length; i++) {
                            retLabelArr.push(result[i]);
                        };
                        return retLabelArr;
                    };
                    dataArr(result);
                    let row = result.map(arr => arr.map(arr => arr[0]));

                    log('result.map(arr => arr.map(arr => arr[0]))', result.map(arr => arr.map(arr => arr[0])));
                    //log('result.map(arr => arr.map(arr => arr[0]))', result.map(arr => arr.map(arr => arr[0])));
                    log('labelArr', labelArr(result.map(arr => arr.map(arr => arr[0]))));

                    bildLineChart(dataArr(result.map(arr => arr.map(arr => arr[2]))),
                        labelArr(result.map(arr => arr.map(arr => arr[0])))[0].map(arr => makeDateForPerfomance(arr), getChoicePeriod(periodChoice)), 'line');
                } else throw err;
            }
            catch (err) { log(err) };
        };
        document.querySelector('.guide').style.display = 'none';
        // const typeOfChart = document.querySelector('.typeOfChart');
        // typeOfChart.style.display = 'block';
    };
};


dqs('#pie').addEventListener('click', builtPieChat);
dqs('#bar').addEventListener('click', builtBarChat);
dqs('#line').addEventListener('click', builtLineGraph);


// !! - build chart with Cartjs module
function bildChart(dataFromDB, dateLabel, color, typeOfChart, legend) {
    if (window.chartDB && window.chartDB !== null) window.chartDB.destroy();
    window.chartDB = new Chart(dqs('#chartFromDB').getContext('2d'), {
        type: typeOfChart,
        data: {
            labels: dateLabel,
            datasets: [
                {
                    label: '',
                    data: dataFromDB,
                    fill: false,
                    backgroundColor: color,
                    borderColor: '#202000',
                    borderWidth: 1
                }]
        },
        options: {
            legend: {
                display: "legend",
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        },
    });
};


function bildLineChart(dataFromDB, dateLabel, typeOfChart) {
    log(dataFromDB);
    if (window.chartDB && window.chartDB !== null) window.chartDB.destroy();
    window.chartDB = new Chart(document.querySelector('#chartFromDB').getContext('2d'), {
        type: typeOfChart,
        data: {
            labels: dateLabel,
            datasets: dataFromDB,
        },
        options: {
            legend: {
                display: true
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        },
    });
    //log(delete window.chartDB.data.datasets[0].label)
};