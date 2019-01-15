
"use strict";

var log = console.log;

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


function setPeriod(set) {
    let period = ["day", "week", "month"];
    let inputs = '';
    for (let i = 0; i <= set; i++) {
        // log(i);
        inputs += `
            <input id="period${period[i]}" type="radio" name="period" value= ${period[i]} />
            <label for="period${period[i]}"> ${period[i]} </label>
         `};
    divPeriodSet.innerHTML = inputs;

};

function periodValidator() {

    let period = timeStampF.valueAsDate - timeStampS.valueAsDate;
    let month = 2678400000;
    let week = 604800000;

    if (period > month) setPeriod(2);
    if (period < month) setPeriod(1);
    if (period < week) setPeriod(0);
    if (timeStampS.value >= timeStampF.value) {
        timeStampS.value = timeStampF.value;
        setPeriod(0);
    };


};

forDateChoise.addEventListener('click', () => divSendReq.style.display = 'none');
divPeriodSet.addEventListener('click', () => divSendReq.style.display = 'block');
forDateChoise.addEventListener('change', periodValidator);
forDateChoise.addEventListener('click', periodValidator);


function getChoicePeriod(periodCheck) {
    for (let period of periodCheck) {
        if (period.checked) return period.value;
    };
};



reqButton.addEventListener('click', async () => {
    const periodChoice = document.querySelectorAll('#periodSet > input');
    if (!getChoicePeriod(periodChoice)) periodChoice[0].checked = true;  // захист від дурнів
    else {
        try {
            let TimeStamp = {
                timeStart: timeStampS.value,
                timeFinish: timeStampF.value,
                period: getChoicePeriod(periodChoice)
            };
            const rawResponse = await fetch('http://localhost:3000/apidb', {
                method: 'POST',
                headers,
                body: JSON.stringify({ TimeStamp })
            });
            // log(TimeStamp);
            const result = await rawResponse.json();
            if (result) {
                log('RESULT', result);

                result.map((rowResult) => {

                    dataTable.innerHTML += `
                                <tr>
                                    <td> ${rowResult.SUM} </td>
                                    
                                </tr>                    
                                                `;
                });
            };
        }
        catch (err) { log(err) };
    };
});