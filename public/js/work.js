
// !!! - coments
"use strict"

const log = console.log;

const divSendReq = document.querySelector('.divSendReq');
const reqButton = document.querySelector('#sendReq');
const timeStampS = document.querySelector('#timeStampS');
const timeStampF = document.querySelector('#timeStampF');
const dataTable = document.querySelector('#dataFromDB > tbody');
const divPeriodSet = document.querySelector('#periodSet');
const forDateChoise = document.querySelector('.forDateChoise');
let request;
//!! just for locking default values
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

const month = 2678400000;
const week = 604800000;
const day = 86400000;
const hour = 3600000;


// !!! - getCheckedDepartments method for specification user`s request according to department
let getCheckedDepartments = () => {
    let serialsArrNumber = [];
    let serials = document.querySelectorAll('.counters>input');
    serials.forEach((serial, i) => {
        if (serial.checked) serialsArrNumber.push(i);
    });
    return serialsArrNumber;
};


// !! - make first request for getting user object from mongo & start date from firebird 
document.addEventListener('DOMContentLoaded', async (request) => {
    request.startValue = true;
    const result = await makeReq(request);

    // !! - creating&rendering checkbox for choice of department according to data from mongo
    const counters = document.querySelector('.counters');
    let departmentArr = result[1].department.split(';')
    departmentArr.pop();
    departmentArr.map((department, i) => {
        let check = document.createElement('input');
        check.type = "checkbox";
        //check.checked = "true";
        check.value = department;
        counters.appendChild(check);
        counters.innerHTML += `<label for=${check}>${department}</label><br>`
    });


    // !! - filing start date from firebird
    if (result.unlogged) {
        window.location.replace('/');
    }
    else if (result) {

        // !! - forming date string
        let dateTimeS = new Date(Date.parse(result[0][0]));
        timeStampS.value = dateTimeS.getFullYear() + '-'
            + (dateTimeS.getMonth() < 10
                ? ('0' + (dateTimeS.getMonth() + 1))
                : (dateTimeS.getMonth() + 1))
            + '-'
            + (dateTimeS.getDate() < 10
                ? ('0' + dateTimeS.getDate())
                : (dateTimeS.getDate()));
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

    // !! - just checking!!! for next idea 
    // document.querySelectorAll('.counters > input').forEach((counter) => counter.addEventListener('change', getCheckedDepartments));
    document.querySelectorAll('.counters > input').forEach((counter) => counter.addEventListener('change', getCheckedDepartments));

});


// !! - rendering radio for choice period for user`s request to firebird
function setPeriod(from, to) {
    let period = ["hour", "day", "week", "month"];
    let periodMs = [hour, day, week, month];
    let inputs = '';
    for (let i = from; i <= to; i++) {
        inputs += `
            <div class="periodSet">
            <input id="period${period[i]}" type="radio" name="period" value= ${periodMs[i]} />
            <label for="period${period[i]}"> ${period[i]} </label>
            </div>
         `};
    divPeriodSet.innerHTML = inputs;
};


// !! - check&create period above
function periodValidator() {
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

let TimeStamp = (timeStampS, timeStampF, periodChoice) => {
    return {
        timeStart: Date.parse(timeStampS.value),
        timeFinish: Date.parse(timeStampF.value),
        period: getChoicePeriod(periodChoice)
    };
};


// !! - get chosen period for user`s request to firebird
function getChoicePeriod(periodCheck) {
    for (let period of periodCheck) {
        if (period.checked) return +period.value;
    };
};


// !! - weekend must get red color
function colourOfWeekend(date, period) {
    date = new Date(Date.parse(date));
    if ((period === day) && ((date.getDay() === 0) || (date.getDay() === 6)))
        return '#e46464'; //(period === day ? (date.getDay() === 0 || date.getDay() === 6 ? ('#e46464') : ('#ffffff')) : ('#ffffff'));
};


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
        const td2 = document.createElement('td');
        td0.textContent = makeDateForPerfomance(rowResult[0], getChoicePeriod(period));
        td1.textContent = makeDateForPerfomance(rowResult[1], getChoicePeriod(period));
        td2.textContent = rowResult[2];
        [td0, td1, td2].map(td => tr.appendChild(td));
        tr.style.background = colourOfWeekend(rowResult[0], getChoicePeriod(period));
        parent.appendChild(tr);
    });
};


// !! - bar chart
let builtBarChat = async () => {
    if (getCheckedDepartments().length === 0) alert("CHOICE SOME DEPARTMENT")
    else {
        const periodChoice = document.querySelectorAll('#periodSet > .periodSet > input');
        if (!getChoicePeriod(periodChoice)) periodChoice[0].checked = true;  // захист від дурнів
        else {
            try {

                let request = defRequest();
                request.barChat = true;
                request.timeStamp = TimeStamp(timeStampS, timeStampF, periodChoice);
                request.serial = getCheckedDepartments();
                // log(request);
                const result = await makeReq(request);

                // !! - checking session
                if (result.unlogged) {
                    log('RESULT:', result);
                    window.location.replace('/');
                }
                else if (result) {
                    //log('RESULT:', result);
                    makeTable(dataTable, result, periodChoice);

                    // !!! necessary to add useful labels & legends


                    bildChart(result.map(arr => arr[2]), result.map(arr => makeDateForPerfomance(arr[0], getChoicePeriod(periodChoice))), 'bar');
                } else throw err;
            }
            catch (err) { log(err) };
        };
        document.querySelector('.guide').style.display = 'none';
        const typeOfChart = document.querySelector('.typeOfChart');
        typeOfChart.style.display = 'block';
    };
};
//===============================================================================
//!!! WILL BE CUT OFF
// !! - make main request for getting data from firebird according to user`s conditions
reqButton.addEventListener('click', builtBarChat);
//================================================================================


// !! - pie chart
let builtPieChat = async () => {
    if (getCheckedDepartments().length === 0) alert("CHOICE SOME DEPARTMENT")
    else {
        const periodChoice = document.querySelectorAll('#periodSet > .periodSet > input');
        if (!getChoicePeriod(periodChoice)) periodChoice[0].checked = true;  // захист від дурнів
        else {
            try {
                let request = defRequest();
                request.timeStamp = TimeStamp(timeStampS, timeStampF, periodChoice);
                request.serial = getCheckedDepartments();
                request.pieChart = true;
                const result = await makeReq(request);

                // !! - checking session
                if (result.unlogged) {
                    log('RESULT:', result);
                    window.location.replace('/');
                }
                else if (result) {
                    //log('RESULT:', result);
                    makeTable(dataTable, result, periodChoice);


                    // !!! necessary to add useful labels & legends
                    //const departmentLabels = document.querySelectorAll('.counters > label');
                    //log(departmentLabels[i].textContent);

                    bildChart(result.map(arr => arr[2]),
                        result.map(arr => makeDateForPerfomance(arr[0], getChoicePeriod(periodChoice))), 'pie');
                } else throw err;
            }
            catch (err) { log(err) };
        };
        document.querySelector('.guide').style.display = 'none';
        const typeOfChart = document.querySelector('.typeOfChart');
        typeOfChart.style.display = 'block';
    };
};

// !! - line graph
let builtLineGraph = async () => {
    if (getCheckedDepartments().length === 0) alert("CHOICE SOME DEPARTMENT")
    else {
        const periodChoice = document.querySelectorAll('#periodSet > .periodSet > input');
        if (!getChoicePeriod(periodChoice)) periodChoice[0].checked = true;  // захист від дурнів
        else {
            try {
                let request = defRequest();;
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
                    makeTable(dataTable, result, periodChoice);

                    // !!! necessary to add useful labels & legends
                    let dataArr = (result) => {
                        let retDataArr = [];
                        for (let i = 0; i < result.length; i++) {
                           // log(result[i]);
                            retDataArr.push({
                                //label: dataFromDB,
                                data: result[i],
                                fill: false,
                                backgroundColor: '#298096',
                                borderColor: '#202000',
                                borderWidth: 1
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
        const typeOfChart = document.querySelector('.typeOfChart');
        typeOfChart.style.display = 'block';
    };
};


document.querySelector('#pie')
    .addEventListener('click', builtPieChat);
document.querySelector('#bar')
    .addEventListener('click', builtBarChat);
document.querySelector('#line')
    .addEventListener('click', builtLineGraph);


// !! - build chart with Cartjs module
function bildChart(dataFromDB, dateLabel, typeOfChart) {
    log(dataFromDB);
    // log(typeof dataFromDB);

    if (window.chartDB && window.chartDB !== null) window.chartDB.destroy();
    window.chartDB = new Chart(document.querySelector('#chartFromDB').getContext('2d'), {
        type: typeOfChart,
        data: {
            labels: dateLabel,
            datasets: [
                {
                    //label: dataFromDB,
                    data: dataFromDB,
                    fill: false,
                    backgroundColor: '#298096',
                    borderColor: '#202000',
                    borderWidth: 1
                }]
        },
        options: {
            legend: {
                display: false
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
                display: false
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