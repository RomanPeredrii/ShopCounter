var log = console.log;

const reqButton = document.querySelector('#sendReq')
const timeStampS = document.querySelector('#timeStampS');
const timeStampF = document.querySelector('#timeStampF');
const dataTable = document.querySelector('#dataFromDB > tbody');

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};


reqButton.addEventListener('click', async () => {
    try {
        let TimeStamp = {
            timeStart: timeStampS.value,
            timeFinish: timeStampF.value
        };
        const rawResponse = await fetch('http://localhost:3000/apidb', {
            method: 'POST',
            headers,
            body: JSON.stringify({ TimeStamp })
        });
        const result = await rawResponse.json();
        if (result) {
            result.map((result) => log('RESULT', result));

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



        };
    }
    catch (err) { log(err) };
});