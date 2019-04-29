
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
let request = {
    startValue: false,
    timeStamp: false,
    serial: false
};

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

const month = 2678400000;
const week = 604800000;
const day = 86400000;
const hour = 3600000;


// !!! - getCheckedSerials method for specification user`s request according to department
let getCheckedSerials = () => {
    let serialsArr = [];
    let serials = document.querySelectorAll('.counters>input');
    serials.forEach((serial) => {
        if (serial.checked) serialsArr.push(serial.value);
    });
    return serialsArr;
};

// !! - make first request for getting user object from mongo & start date from firebird 
document.addEventListener('DOMContentLoaded', async (request) => {
    request.startValue = true;
    const result = await makeReq(request);


    // !! - creating&rendering checkbox for choice of department according to data from mongo
    const counters = document.querySelector('.counters');
    let countersArr = result[1].counters.split(';');
    let departmentArr = result[1].department.split(';')
    countersArr.pop();
    departmentArr.pop();
    countersArr.map((counter, i) => {
        let check = document.createElement('input');
        check.type = "checkbox";
        check.checked = "true";
        check.value = counter;
        counters.appendChild(check);
        counters.innerHTML += `<label for=${check}>${departmentArr[i]}</label><br>`
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
    document.querySelectorAll('.counters > input').forEach((counter) => counter.addEventListener('change', getCheckedSerials));

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
        const rawResponse = await fetch('http://localhost:3000/api/apidbwork', {
            method: 'POST',
            headers,
            body: JSON.stringify({ request })
        });
        const result = await rawResponse.json();
        return result;
    }
    catch (err) { 'fetch ERROR', log(err) };
};

// !! - make main request for getting data from firebird according to user`s conditions
reqButton.addEventListener('click', async () => {
    //log('DATE', timeStampS.valueAsDate);
    if (getCheckedSerials().length === 0) alert("CHOICE SOME DEPARTMENT") 
    else {
        const periodChoice = document.querySelectorAll('#periodSet > .periodSet > input');
        if (!getChoicePeriod(periodChoice)) periodChoice[0].checked = true;  // захист від дурнів
        else {
            try {
                let TimeStamp = {
                    timeStart: Date.parse(timeStampS.value),
                    timeFinish: Date.parse(timeStampF.value),
                    period: getChoicePeriod(periodChoice)
                };
                request.timeStamp = TimeStamp;
                request.serial = getCheckedSerials();
                const result = await makeReq(request);

                // !! - checking session
                if (result.unlogged) {
                    log('RESULT:', result);
                    window.location.replace('/');
                }
                else if (result) {

                    // !! - creating table for rendering requested data from firebird
                    dataTable.innerHTML = '';
                    result.map((rowResult) => {
                        const tr = document.createElement('tr');
                        const td0 = document.createElement('td');
                        const td1 = document.createElement('td');
                        const td2 = document.createElement('td');
                        td0.textContent = makeDateForPerfomance(rowResult[0], getChoicePeriod(periodChoice));
                        td1.textContent = makeDateForPerfomance(rowResult[1], getChoicePeriod(periodChoice));
                        td2.textContent = rowResult[2];
                        [td0, td1, td2].map(td => tr.appendChild(td));
                        tr.style.background = colourOfWeekend(rowResult[0], getChoicePeriod(periodChoice));
                        dataTable.appendChild(tr);
                    });

                    // !! - building different kind of charts
                    document.querySelector('.guide').style.display = 'none';
                    var barChart = document.querySelector('#bar')
                    barChart.addEventListener('click', () => bildChart(result.map(arr => arr[2]),
                        result.map(arr => makeDateForPerfomance(arr[0], getChoicePeriod(periodChoice))), barChart.value));

                    var lineChart = document.querySelector('#line')
                    lineChart.addEventListener('click', () => bildChart(result.map(arr => arr[2]),
                        result.map(arr => makeDateForPerfomance(arr[0], getChoicePeriod(periodChoice))), lineChart.value));

                    var pieChart = document.querySelector('#pie')
                    pieChart.addEventListener('click', () => bildChart(result.map(arr => arr[2]),
                        result.map(arr => makeDateForPerfomance(arr[0], getChoicePeriod(periodChoice))), pieChart.value));

                    bildChart(result.map(arr => arr[2]),
                        result.map(arr => makeDateForPerfomance(arr[0], getChoicePeriod(periodChoice))), 'bar');

                } else throw err;
            }
            catch (err) { log(err) };
        };
        const typeOfChart = document.querySelector('.typeOfChart');
        typeOfChart.style.display = 'block';
    };
});


// !! - build chart with Cartjs module
function bildChart(dataFromDB, dateLabel, typeOfChart) {

    if (window.chartDB && window.chartDB !== null) window.chartDB.destroy();

    var chartCanvas = document.querySelector('#chartFromDB').getContext('2d');

    window.chartDB = new Chart(chartCanvas, {

        type: typeOfChart,

        data: {
            labels: dateLabel,
            datasets: [{
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