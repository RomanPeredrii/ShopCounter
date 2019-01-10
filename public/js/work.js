
'use strict'

var log = console.log;


const reqButton = document.querySelector('#sendReq')
const timeStampS = document.querySelector('#timeStampS');
const timeStampF = document.querySelector('#timeStampF');
const dataTable = document.querySelector('#dataFromDB > tbody');
const periodChoice = document.querySelectorAll('#periodSet > input');

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};




const forDateChoise = document.querySelector('.forDateChoise > tbody > tr');
//log(forDateChoise);




//timeStampS.addEventListener('change', );
//timeStampF.addEventListener('change', periodValidator);

function setPeriod(periodCheck) {
    for (let period of periodChoice) { log(period, periodCheck)
        if (period.value !== periodCheck) period.checked = false
        else period.checked = true;
    };
};

function periodValidator() {

    if (timeStampS.value > timeStampF.value) {
        timeStampS.value = timeStampF.value;
        setPeriod('day');
    };

    if ((timeStampF.valueAsDate - timeStampS.valueAsDate) < 2678400000) {
       // periodChoice[0].checked = false;
       // periodChoice[1].checked = true;
    };


    log(timeStampS.value, timeStampF.value);
};




forDateChoise.addEventListener('change', periodValidator)
forDateChoise.addEventListener('click', periodValidator)


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
            /*
                        result.map((rowResult) => {
            
                            dataTable.innerHTML += `
                                <tr>
                                    <td> ${rowResult.CH1} </td>
                                    <td> ${rowResult.CH2} </td>
                                    <td> ${rowResult.TIMEPOINT} </td>
                                    <td> ${rowResult.SERIAL} </td>
                                </tr>                    
                                                `;
                        });
            */

        };
    }
    catch (err) { log(err) };
});