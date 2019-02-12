
"use strict"

const log = console.log;

const divSendReq = document.querySelector('.divSendReq');
const reqButton = document.querySelector('#sendReq');
const timeStampS = document.querySelector('#timeStampS');
const timeStampF = document.querySelector('#timeStampF');
const dataTable = document.querySelector('#dataFromDB > tbody');
const divPeriodSet = document.querySelector('#periodSet');
const forDateChoise = document.querySelector('.forDateChoise');

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

const month = 2678400000;
const week = 604800000;
const day = 86400000;
const hour = 3600000;

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

function periodValidator() {
    let period = timeStampF.valueAsDate - timeStampS.valueAsDate;
    if (period > month) setPeriod(1, 3);
    if (period < month) setPeriod(1, 2);
    if (period < week) setPeriod(0, 1);
    if (timeStampS.value >= timeStampF.value) {
        timeStampS.value = timeStampF.value;
        setPeriod(0, 1);
    };
};

forDateChoise.addEventListener('click', () => divSendReq.style.display = 'none');
divPeriodSet.addEventListener('click', () => divSendReq.style.display = 'inline-block');
forDateChoise.addEventListener('change', periodValidator);
forDateChoise.addEventListener('click', periodValidator);

function getChoicePeriod(periodCheck) {
    for (let period of periodCheck) {
        if (period.checked) return +period.value;
    };
};

function colourOfWeekend(date, period) {
    date = new Date(Date.parse(date));
    if ((period === day) && ((date.getDay() === 0) || (date.getDay() === 6)))
        return '#e46464'; //(period === day ? (date.getDay() === 0 || date.getDay() === 6 ? ('#e46464') : ('#ffffff')) : ('#ffffff'));
};

function makeDateForPerfomance(dateTime, period) {
    dateTime = new Date(Date.parse(dateTime));

    return (period === hour
        ? (dateTime.getFullYear() + '-' + (dateTime.getMonth() + 1) + '-' +
            dateTime.getDate() + ' ' + dateTime.getHours() + ':' + dateTime.getMinutes() + '0')
        : (dateTime.getFullYear() + '-' + (dateTime.getMonth() + 1) + '-' +
            dateTime.getDate()));
};

reqButton.addEventListener('click', async () => {

    log('DATE', timeStampS.valueAsDate);

    const periodChoice = document.querySelectorAll('#periodSet > .periodSet > input');
    if (!getChoicePeriod(periodChoice)) periodChoice[0].checked = true;  // захист від дурнів
    else {
        try {
            let TimeStamp = {
                timeStart: Date.parse(timeStampS.value),
                timeFinish: Date.parse(timeStampF.value),
                period: getChoicePeriod(periodChoice)
            };
            log('-------', TimeStamp);

            const rawResponse = await fetch('http://localhost:3000/api/apidb', {
                method: 'POST',
                headers,
                body: JSON.stringify({ TimeStamp })
            });

            const result = await rawResponse.json();
            log('RESULT:', result);
            log('work LOGGED:', result.unlogged);
            if (result.unlogged) {
                log('RESULT:', result); window.location.replace('/');
            }
            else if (result) {

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

});



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