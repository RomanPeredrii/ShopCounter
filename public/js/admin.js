"use strict"

const log = console.log;

const optionHostDBData = document.querySelector('#optionsHost');
const optionPortDBData = document.querySelector('#optionsPort');
const optionPathDBData = document.querySelector('#optionsPath');
const optionUserDBData = document.querySelector('#optionsUser');
const optionRoleDBData = document.querySelector('#optionsRole');
const optionPasswordDBData = document.querySelector('#optionsPassword');
const optionPageSizeDBData = document.querySelector('#optionsPageSize');
const compositionDB = document.querySelector('#compositionDB > tbody');
const compositionTable = document.querySelector('#compositionTable > tbody');
const termText = document.querySelector('#textar');
const scriptInput = document.querySelector('#scriptInput');

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

document.querySelector('#connect').addEventListener('click', async () => {

    try {
        request.db = true;
        const result = await makeReq(request);
        if (result.unlogged) {
            window.location.replace('/');
        }
        else {
            compositionDB.innerHTML = '';
            showDB(compositionDB, result);
            connect.style.display = 'none';
        }
    }
    catch (err) { log(err) };
});

async function wievDB(result) {
    result.map(async (rowResult) => {
        log(typeof rowResult, rowResult);
        showDB(compositionDB, rowResult)
    });
};

async function getComposition(evt) {
    log(evt.path[0].innerText);
    request.tableName = evt.path[0].innerText;
    try {
        request.db = true;
        const result = await makeReq(request);
        if (result.unlogged) {
            window.location.replace('/');
        }
        else {
            compositionTable.innerHTML = '';
            showTable(compositionTable, result);
        };
    }
    catch (err) { log(err) };
};

function showDB(context, data) {

    data.map((data) => {
        data.map((data) => {
            log(data[1].replace(/\s+/g, ''));
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.textContent = data[1].replace(/\s+/g, '');
            td.addEventListener('click', getComposition);
            tr.appendChild(td);
            context.appendChild(tr);
        });
    });
};

function showTable(context, data) {
    let hat;
    data.map((data) => {
        const trD = document.createElement('tr');
        const trH = document.createElement('tr');
        if (!hat) {
            data.map((data) => {
                const th = document.createElement('th');
                th.textContent = data[0];
                trH.appendChild(th);
            });
            context.appendChild(trH);
            hat = 1;
        }
        else {
            data.map((data) => {
                const td = document.createElement('td');
                td.textContent = data[1];
                trD.appendChild(td);
            });
            context.appendChild(trD);
        };
    });
};

let makeReq = async (request) => {
    try {
        const rawResponse = await fetch('http://localhost:3000/api/apidbadmin', {
            method: 'POST',
            headers,
            body: JSON.stringify({ request })
        });
        const result = await rawResponse.json();
        log(result);
        return result;
    }
    catch (err) { 'fetch ERROR', log(err) };
};

scriptInput.addEventListener('keydown',async  function (evt) {
    if (evt.key === 'Enter') {
        termText.textContent += this.value + '\n';
        
        request.script = this.value;
        
        let result = await makeReq(request); log(request);
        termText.textContent += result;
        showTable(compositionTable, result);
        //this.value = '';
    };
}.bind(scriptInput), false);

