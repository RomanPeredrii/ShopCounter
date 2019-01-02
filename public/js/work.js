var log = console.log;

const reqButton = document.querySelector('#sendReq')
const timeStampS = document.querySelector('#timeStampS');
const timeStampF = document.querySelector('#timeStampF');

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
    if (result) log(result);//window.location.replace('http://localhost:3000/api/work');;
}
catch (err) { log(err) };
});