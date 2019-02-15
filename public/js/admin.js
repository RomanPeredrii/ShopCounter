"use strict"

const log = console.log;

const optionHostDBData = document.querySelector('#optionsHost');
const optionPortDBData = document.querySelector('#optionsPort');
const optionPathDBData = document.querySelector('#optionsPath');
const optionUserDBData = document.querySelector('#optionsUser');
const optionRoleDBData = document.querySelector('#optionsRole');
const optionPasswordDBData = document.querySelector('#optionsPassword');
const optionPageSizeDBData = document.querySelector('#optionsPageSize');
const checkConnection = document.querySelector('#checkConnection');

const compositionDB = document.querySelector('#compositionDB > tbody');

// OPTION FOR ATTACH DB
const options = {
    host: optionHostDBData.value,
    port: optionPortDBData.value,
    database: optionPathDBData.value,
    user: optionUserDBData.value,
    password: optionPasswordDBData.value,
    pageSize: optionPageSizeDBData.value,
    role: optionRoleDBData.value
};

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

checkConnection.addEventListener('click', async () => {
    //log(options)

    try {

        const rawResponse = await fetch('http://localhost:3000/api/apidbadmin', {
            method: 'POST',
            headers,
            body: JSON.stringify({ options })
        });

        const result = await rawResponse.json();

        log('RESULT:', result);

        if (result.unlogged) {
            window.location.replace('/');
            //log('IF RESULT :', result);
        }
        else {
            // log('ELSE RESULT :', result);

            compositionDB.innerHTML = '';
            wievDB(result);


        }
    }
    catch (err) { log(err) };
});

function wievDB(result) {
    result.map((rowResult) => {
        log(typeof rowResult, rowResult);
        
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = rowResult;
        td.addEventListener('click', () => { log(rowResult) });
        tr.appendChild(td);
        compositionDB.appendChild(tr);
    });
}