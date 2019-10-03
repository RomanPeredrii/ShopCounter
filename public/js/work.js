// !!! - coments
import List from '../my_modules/list.js';
import Request from '../my_modules/request.js';
import Gather from '../my_modules/gather.js';
import { log, dqs, dqsA } from '../my_modules/stuff.js';
import Preloader from '../my_modules/preloader.js';

const counters = dqs('.counters');
const periodSetting = dqs('.periodSetting');
const timeStampS = dqs('#timeStampS');
const timeStampF = dqs('#timeStampF');
const intervalSetting = dqs('.intervalSetting');
const sendRequest = dqs('.sendRequest');
const builtPieChat = dqs('#pie');
const builtBarChat = dqs('#bar');
const builtLineGraph = dqs('#line');
const dataTable = dqs('#data > tbody');

const preloader = new Preloader('.preloader');

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

const state = {
    firstDate: null,
    counters: false,
    periodSetting: false,
    startDate: null,
    finishDate: null,
    intervalSetting: false,
    period: null
}

// !!! - make first request for getting user object from mongo & start date from firebird 
document.addEventListener('DOMContentLoaded', async() => {
    try {
        const request = new Request();
        preloader.show();
        const result = await request.makeRequest('/api/apidbwork', { startValue: true });
        // !!- filling start date from firebird
        if (result) preloader.hide();
        if (result.unlogged) {
            window.location.replace('/')
        } else if (result.error) {
            log(error.message)
        } else if (result) {
            setDefaultDates(result[0].MIN);
            //!!- create list of counters
            const list = new List(result[1], "department", '.counters');
            list.showCheckboxList();
            state.counters = true;
        };
    } catch (err) { log('counters list', err) };
});

// !!! - make visible next step
counters.addEventListener('change', () => {
    let gather = new Gather('.counters', null);
    if (Object.keys(gather.getCheckedValues()).length !== 0) periodSetting.style.display = 'block'
    else periodSetting.style.display = intervalSetting.style.display = sendRequest.style.display = 'none';

});
// !!!- make dateString for input value
const formatedDate = (date) => `${date.getFullYear()}-${
    (date.getMonth() < 9 ? ('0' + ((date.getMonth() + 1))) : (date.getMonth() + 1))}-${
    (date.getDate() < 10 ? ('0' + date.getDate()) : (date.getDate()))}`;

// !!! - set default dates
const setDefaultDates = (date) => {
    // !! - forming start date string
    timeStampS.value = formatedDate(new Date(Date.parse(date)));
    // !! - forming finish date string
    timeStampF.value = formatedDate(new Date());
};

// !!! - rendering radio for choice period for user`s request to firebird
const setPeriod = (substrate, from, to) => {
    const period = ["hour", "day", "week", "month"];
    let inputs = '';
    for (let i = from; i <= to; i++) {
        inputs += `
            <div class="periodSet">
            <input id="period${period[i]}" type="radio" name="period" value= ${period[i]} /> ${period[i]}             
            </div>
         `
    };
    substrate.style.display = 'block';
    substrate.innerHTML = inputs;
};

// !! - check&create period above
const periodValidator = () => {
    const month = 2678400000;
    const week = 604800000;
    let period = timeStampF.valueAsDate - timeStampS.valueAsDate;
    if (period > month) setPeriod(intervalSetting, 1, 3);
    if (period < month) setPeriod(intervalSetting, 1, 2);
    if (period < week) setPeriod(intervalSetting, 0, 1);
    // !! - check start finish dates 
    if (timeStampS.value >= timeStampF.value) {
        timeStampS.value = timeStampF.value;
        setPeriod(intervalSetting, 0, 1);
    };
};

['change', 'mouseup'].map(evt => periodSetting.addEventListener(evt, periodValidator));

intervalSetting.addEventListener('change', () => {
    sendRequest.style.display = 'flex';
    builtPieChat.style.display = 'block'
    builtBarChat.style.display = 'block';
    builtLineGraph.style.display = 'block';
});


// intervalSetting.addEventListener('click', () => {
//     sendRequest.style.display = 'flex';
//     builtPieChat.style.display = 'block'
// });


// !! - pie chart
const pieChat = async() => {
    try {
        const gatherDepartments = new Gather('.counters', null);
        const gatherDates = new Gather('.periodSetting', null);
        const gatherPeriod = new Gather('.intervalSetting', null);
        const request = new Request();
        log({
            type: 'pieChart',
            departments: gatherDepartments.getCheckedValues(),
            dates: gatherDates.getCheckedValues(),
            ...gatherPeriod.getCheckedValues()
        });
        const result = await request.makeRequest('/api/apidbwork', {
            type: 'pieChart',
            departments: gatherDepartments.getCheckedValues(),
            dates: gatherDates.getCheckedValues(),
            ...gatherPeriod.getCheckedValues()
        });
        // !! - checking session
        if (result.unlogged) {
            log('RESULT:', result);
            window.location.replace('/');
        } else if (result) {
            dataTable.style.display = 'block';
            makeTable(dataTable, result, gatherPeriod.getCheckedValues().period);
            bildChart(result.map(arr => arr[1]),
                result.map(arr => arr[0]),
                result.map(arr => arr[3]), 'pie', true);
            preloader.hide();
        } else throw err;
    } catch (err) { log(err) };
    dqs('.guide').style.display = 'none';
};


// !! - bar chart
let barChat = async() => {
    try {
        const gatherDepartments = new Gather('.counters', null);
        const gatherDates = new Gather('.periodSetting', null);
        const gatherPeriod = new Gather('.intervalSetting', null);
        const request = new Request();
        log({
            type: 'pieChart',
            departments: gatherDepartments.getCheckedValues(),
            dates: gatherDates.getCheckedValues(),
            ...gatherPeriod.getCheckedValues()
        });
        const result = await request.makeRequest('/api/apidbwork', {
            type: 'barChart',
            departments: gatherDepartments.getCheckedValues(),
            dates: gatherDates.getCheckedValues(),
            ...gatherPeriod.getCheckedValues()
        });

        log(result);
        // !! - checking session
        if (result.unlogged) {
            window.location.replace('/');
        } else if (result) {



            //log('RESULT:', result);
            dataTable.style.display = 'block';
            // makeTable(dataTable, result, periodChoice);
            // !!! necessary to add useful labels & legends
            bildChart(result.map(arr => arr[0]), result.map(arr => arr[1]), '#0275aa', 'bar', false);
            preloader.hide();
        } else throw err;
    } catch (err) { log(err) };

    document.querySelector('.guide').style.display = 'none';
    // const typeOfChart = document.querySelector('.typeOfChart');
    // typeOfChart.style.display = 'block';
};

// !! - line graph
let lineGraph = async() => {
    log(gather.getCheckedValues())
    if (getCheckedDepartments().length === 0) alert("CHOICE SOME DEPARTMENT")
    else {
        const periodChoice = document.querySelectorAll('#periodSet > .periodSet > input');
        if (!getChoicePeriod(periodChoice)) periodChoice[0].checked = true; // захист від дурнів
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
                } else if (result) {
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
            } catch (err) { log(err) };
        };
        document.querySelector('.guide').style.display = 'none';
        // const typeOfChart = document.querySelector('.typeOfChart');
        // typeOfChart.style.display = 'block';
    };
};


builtPieChat.addEventListener('mouseup', pieChat);
builtBarChat.addEventListener('mouseup', barChat);
builtLineGraph.addEventListener('mouseup', lineGraph);

// // // // // // // // // // // // // // // // // // // // // // // // // 
// MUST BE MOVED ON BACK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// !! - get chosen period for user`s request to firebird
function getChoicePeriod(periodCheck) {
    for (let period of periodCheck) {
        if (period.checked) return period.value;
    };
};
// // // // // // // // // // // // // // // // // // // // // // // // // 

//!!! just for locking default revalues
const defaultRequest = () => {
    return {
        startValue: false,
        timeStamp: false,
        serial: false,
        period: false
    };
};

let gather = new Gather('.left'); // have to be deleted!!!!!!!!!!!!!!!!



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



// !!! - getCheckedDepartments method for specification user`s request according to department 
// WILL BE DELETED!!!!!
let getCheckedDepartments = () => {
    let serialsArrNumber = [];
    let serials = document.querySelectorAll('.counters>input');
    serials.forEach((serial, i) => {
        if (serial.checked) serialsArrNumber.push(i);
    });
    return serialsArrNumber;
};

//WILL BE REMOVED!!!!!
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

// !! - forming date string for datatable 
function makeDateForPerfomance(dateTime, period) {
    dateTime = new Date(Date.parse(dateTime));
    return (period === hour ?
        (dateTime.getFullYear() + '-' + (dateTime.getMonth() + 1) + '-' +
            dateTime.getDate() + ' ' + dateTime.getHours() + ':' + dateTime.getMinutes() + '0') :
        (dateTime.getFullYear() + '-' + (dateTime.getMonth() + 1) + '-' +
            dateTime.getDate()));
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


// !! - wrapping for fetch
let makeReq = async(request) => {
    try {
        const rawResponse = await fetch('/api/apidbwork', {
            method: 'POST',
            headers,
            body: JSON.stringify({ request })
        });
        const result = await rawResponse.json();
        return result;
    } catch (err) { 'fetch ERROR', log(err) };
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
// const pieChat = async() => {
//     // if (getCheckedDepartments().length === 0) alert("CHOICE SOME DEPARTMENT")
//     // else {
//     //     const periodChoice = document.querySelectorAll('#periodSet > .periodSet > input');
//     //     if (!getChoicePeriod(periodChoice)) periodChoice[0].checked = true; // захист від дурнів
//     //     else {
//     try {

//         const gatherDepartments = new Gather('.counters', null);
//         const gatherDates = new Gather('.period', null);
//         const gatherPeriod = new Gather('.periodSet', null);
//         log('!!', {
//             type: 'pieChart',
//             period: gatherPeriod.getLocalCheckedValues(),
//             departments: gatherDepartments.getCheckedValues(),
//             dates: gatherDates.getCheckedValues()
//         });

//         // const gather = new Gather('.left', null);
//         // gather.getCheckedValues().type = 'pieChart';
//         const request = new Request();
//         // preloader.show();
//         // log('request', {...gather.getCheckedValues(), type: 'pieChart' });
//         const result = await request.makeRequest('/api/apidbwork', {
//             type: 'pieChart',
//             departments: gatherDepartments.getCheckedValues(),
//             dates: gatherDates.getCheckedValues(),
//             ...gatherPeriod.getLocalCheckedValues()
//         });
//         // log('result', result);
//         // !! - checking session
//         if (result.unlogged) {
//             log('RESULT:', result);
//             window.location.replace('/');
//         } else if (result) {
//             dataTable.style.display = 'block';
//             makeTable(dataTable, result, periodChoice);

//             bildChart(result.map(arr => arr[1]),
//                 result.map(arr => arr[0]),
//                 result.map(arr => arr[3]), 'pie', true);
//             preloader.hide();
//         } else throw err;
//     } catch (err) { log(err) };
//     // };
//     dqs('.guide').style.display = 'none';
// };
// };

// // !! - bar chart
// let builtBarChat = async() => {
//     if (getCheckedDepartments().length === 0) alert("CHOICE SOME DEPARTMENT")
//     else {
//         const periodChoice = document.querySelectorAll('#periodSet > .periodSet > input');
//         if (!getChoicePeriod(periodChoice)) periodChoice[0].checked = true; // захист від дурнів
//         else {
//             try {
//                 const gather = new Gather('.left', defaultRequest());
//                 gather.getCheckedValues().type = 'barChat';

//                 const request = new Request();

//                 preloader.show();
//                 log('request', gather.getCheckedValues());
//                 const result = await request.makeRequest('/api/apidbwork', gather.getCheckedValues());
//                 log('RESULT:', result);
//                 // !! - checking session
//                 if (result.unlogged) {
//                     window.location.replace('/');
//                 } else if (result) {

//                     //log('RESULT:', result);
//                     dataTable.style.display = 'block';
//                     makeTable(dataTable, result, periodChoice);
//                     // !!! necessary to add useful labels & legends
//                     bildChart(result.map(arr => arr[0]), result.map(arr => arr[1]), '#5c745f', 'bar', false);
//                     preloader.hide();
//                 } else throw err;
//             } catch (err) { log(err) };
//         };
//         document.querySelector('.guide').style.display = 'none';
//         // const typeOfChart = document.querySelector('.typeOfChart');
//         // typeOfChart.style.display = 'block';
//     };
// };
//===============================================================================
//!!! WILL BE CUT OFF
// !! - make main request for getting data from firebird according to user`s conditions
//reqButton.addEventListener('click', builtBarChat);
//================================================================================




// // !! - line graph
// let lineGraph = async() => {
//     log(gather.getCheckedValues())
//     if (getCheckedDepartments().length === 0) alert("CHOICE SOME DEPARTMENT")
//     else {
//         const periodChoice = document.querySelectorAll('#periodSet > .periodSet > input');
//         if (!getChoicePeriod(periodChoice)) periodChoice[0].checked = true; // захист від дурнів
//         else {
//             try {
//                 let request = defRequest();
//                 request.lineGraph = true;
//                 request.timeStamp = TimeStamp(timeStampS, timeStampF, periodChoice);
//                 request.serial = getCheckedDepartments();
//                 // log(request);
//                 const result = await makeReq(request);

//                 // !! - checking session
//                 if (result.unlogged) {
//                     //log('RESULT:', result);
//                     window.location.replace('/');
//                 } else if (result) {
//                     //log('RESULT:', result);
//                     dataTable.style.display = 'none';

//                     // !!! necessary to add useful labels & legends
//                     let dataArr = (result) => {
//                         let retDataArr = [];
//                         for (let i = 0; i < result.length; i++) {
//                             // log(result[i]);
//                             let color = makeRandomColor();
//                             retDataArr.push({
//                                 label: dataFromDB,
//                                 data: result[i],
//                                 fill: false,
//                                 backgroundColor: color,
//                                 borderColor: color,
//                                 borderWidth: 2
//                             });
//                         };
//                         return retDataArr;
//                     };

//                     let labelArr = (result) => {
//                         let retLabelArr = [];
//                         for (let i = 0; i < result.length; i++) {
//                             retLabelArr.push(result[i]);
//                         };
//                         return retLabelArr;
//                     };
//                     dataArr(result);
//                     let row = result.map(arr => arr.map(arr => arr[0]));

//                     log('result.map(arr => arr.map(arr => arr[0]))', result.map(arr => arr.map(arr => arr[0])));
//                     //log('result.map(arr => arr.map(arr => arr[0]))', result.map(arr => arr.map(arr => arr[0])));
//                     log('labelArr', labelArr(result.map(arr => arr.map(arr => arr[0]))));

//                     bildLineChart(dataArr(result.map(arr => arr.map(arr => arr[2]))),
//                         labelArr(result.map(arr => arr.map(arr => arr[0])))[0].map(arr => makeDateForPerfomance(arr), getChoicePeriod(periodChoice)), 'line');
//                 } else throw err;
//             } catch (err) { log(err) };
//         };
//         document.querySelector('.guide').style.display = 'none';
//         // const typeOfChart = document.querySelector('.typeOfChart');
//         // typeOfChart.style.display = 'block';
//     };
// };




// dqs('#line').addEventListener('click', builtLineGraph);


// !! - build chart with Cartjs module
function bildChart(dataFromDB, dateLabel, color, typeOfChart, legend) {
    if (window.chartDB && window.chartDB !== null) window.chartDB.destroy();
    window.chartDB = new Chart(dqs('#chartFromDB').getContext('2d'), {
        type: typeOfChart,
        data: {
            labels: dateLabel,
            datasets: [{
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