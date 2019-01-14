
"use strict";

var log = console.log;

const reqButton = document.querySelector('#sendReq')
const timeStampS = document.querySelector('#timeStampS');
const timeStampF = document.querySelector('#timeStampF');
const dataTable = document.querySelector('#dataFromDB > tbody');
const periodChoice = document.querySelectorAll('#periodSet > input');
const divPeriodSet = document.querySelector('#periodSet');


const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};




//const forDateChoise = document.querySelector('.forDateChoise > tbody > tr');
//log(forDateChoise);

//timeStampS.addEventListener('change', );
//timeStampF.addEventListener('change', periodValidator);

function blockPeriod(periodCheck) {
    for (let period of periodChoice) {
        if (period.value === periodCheck) period.checked = false;

    };
};


function setPeriod(periodCheck) {
    for (let period of periodChoice) {
        if (period.value !== periodCheck) period.checked = false;
        else period.checked = true;
    };
};

function periodValidator() {

    if ((timeStampF.valueAsDate - timeStampS.valueAsDate) < 2678400000) {
        blockPeriod('month');
        if ((timeStampF.valueAsDate - timeStampS.valueAsDate) < 604800000) {
            blockPeriod('week');
            setPeriod('day');
            if (timeStampS.value >= timeStampF.value) {
                timeStampS.value = timeStampF.value;
                setPeriod('day');
            };
        };
    };

//    log(timeStampS.value, timeStampF.value);
};

divPeriodSet.addEventListener('click', periodValidator);
divPeriodSet.addEventListener('change', periodValidator);
//forDateChoise.addEventListener('change', periodValidator);
//forDateChoise.addEventListener('click', periodValidator);


function getChoicePeriod(periodCheck) {
    for (let period of periodCheck) {
        if (period.checked) return period.value;
    };

};

reqButton.addEventListener('click', async () => {
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
});