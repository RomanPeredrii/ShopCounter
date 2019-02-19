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
const request = {
    options: {
        host: optionHostDBData.value,
        port: optionPortDBData.value,
        database: optionPathDBData.value,
        user: optionUserDBData.value,
        password: optionPasswordDBData.value,
        pageSize: optionPageSizeDBData.value,
        role: optionRoleDBData.value
    }
};

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

checkConnection.addEventListener('click', async () => {

    try {
        request.db = true;
        const result = await sendReq(request);
        if (result.unlogged) {
            window.location.replace('/');
        }
        else {
            compositionDB.innerHTML = '';
            wievDB(result);
        }
    }
    catch (err) { log(err) };
});

async function wievDB(result) {
    result.map(async (rowResult) => {
        log(typeof rowResult, rowResult);
        showData(compositionDB, rowResult)
    });
};

function makeReq(evt) {
    log(evt.path[0].innerText);
    request.tableName = evt.path[0].innerText;
    sendReq(request)
};

function showData(context, data) {
    const tr = document.createElement('tr');
    if (Array.isArray(data)) {
        data.map(async (rowResult) => {
/*++++++++++++++++++++++++++++++++++++++++++++++++ */
        });
    }
    else {
        const td = document.createElement('td');
        td.textContent = data;
        td.addEventListener('click', makeReq);
        tr.appendChild(td);
    };
    context.appendChild(tr);
};


async function sendReq(request) {
    try {
        const rawResponse = await fetch('http://localhost:3000/api/apidbadmin', {
            method: 'POST',
            headers,
            body: JSON.stringify({ request })
        });
        const result = await rawResponse.json();
        return result;
    }
    catch (err) { log(err) };
};

