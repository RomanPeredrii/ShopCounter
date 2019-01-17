
const submitButton = document.querySelector('#submitButton');
const inlineFormInput = document.querySelector('#inlineFormInput');
const inlineFormInputGroup = document.querySelector('#inlineFormInputGroup');
const checkCookie = document.querySelector('#checkCookie');

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};


submitButton.addEventListener('click', async () => {
   // socket.emit('sendLogInfo', UserLogInfo);
   try {
    let UserLogInfo = {
        userName: inlineFormInput.value,
        pswd: inlineFormInputGroup.value
    };
    const rawResponse = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers,
        body: JSON.stringify({ UserLogInfo })
    });
    const result = await rawResponse.json();
    if (result.ok) window.location.replace('http://localhost:3000/api/work');;
}
catch (err) { log(err) };

});


