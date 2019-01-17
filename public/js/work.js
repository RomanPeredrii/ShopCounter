
"use strict"

const log = console.log;

const divSendReq = document.querySelector('.divSendReq');
const reqButton = document.querySelector('#sendReq');
const timeStampS = document.querySelector('#timeStampS');
const timeStampF = document.querySelector('#timeStampF');
const dataTable = document.querySelector('#dataFromDB > tbody');
const divPeriodSet = document.querySelector('#periodSet');
const forDateChoise = document.querySelector('.forDateChoise > tbody > tr');

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
            <input id="period${period[i]}" type="radio" name="period" value= ${periodMs[i]} />
            <label for="period${period[i]}"> ${period[i]} </label>
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
        setPeriod(0, 0);
    };
};

forDateChoise.addEventListener('click', () => divSendReq.style.display = 'none');
divPeriodSet.addEventListener('click', () => divSendReq.style.display = 'block');
forDateChoise.addEventListener('change', periodValidator);
forDateChoise.addEventListener('click', periodValidator);

function getChoicePeriod(periodCheck) {
    for (let period of periodCheck) {
        if (period.checked) return +period.value;
    };
};

reqButton.addEventListener('click', async () => {
    const periodChoice = document.querySelectorAll('#periodSet > input');
    if (!getChoicePeriod(periodChoice)) periodChoice[0].checked = true;  // захист від дурнів
    else {
        try {
            let TimeStamp = {
                timeStart: Date.parse(timeStampS.value),
                timeFinish: Date.parse(timeStampF.value),
                period: getChoicePeriod(periodChoice)
            };
            log('-------', TimeStamp);
            const rawResponse = await fetch('http://localhost:3000/apidb', {
                method: 'POST',
                headers,
                body: JSON.stringify({ TimeStamp })

            });

            const result = await rawResponse.json();
            if (result) {
                log('RESULT', result);

                result.map((rowResult) => { log('RESULT', rowResult[0].SUM);

                    dataTable.innerHTML += `
                                <tr>
                                    <td> ${rowResult[0].SUM} </td>
                                    
                                </tr>
                                                `;
                });
            };
        }
        catch (err) { log(err) };
    };
});