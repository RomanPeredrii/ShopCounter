const log = console.log;
const submitButton = document.querySelector('#submitButton');
const inlineFormInput = document.querySelector('#inlineFormInput');
const inlineFormInputGroup = document.querySelector('#inlineFormInputGroup');

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

// !! - make query for get next page according to name&pswd
submitButton.addEventListener('click', async () => {    
    if (!document.querySelector('#accept').checked) alert("DON'T YOU AGREE LEGAL TERMS?")
    else {
    try {
        let UserLogInfo = {
            userName: inlineFormInput.value,
            pswd: inlineFormInputGroup.value
        };
        const rawResponse = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers,
            body: JSON.stringify({ UserLogInfo })
        });
// !! - relocate according to name&pswd
        const result = await rawResponse.json();
        if (result.error) alert('USER OR PASSWORD INCORRECT');
        else if (result.admin) window.location.replace('http://localhost:3000/pages/admin');
        else if (result.ok) window.location.replace('http://localhost:3000/pages/work');
    }
    catch (err) { log(err) };
};
});


