// evt = event;
// cont = context;
// i = item;
// opt = option;

"use strict"

const log = console.log;

const dqs = (cont) => {
    return document.querySelector(cont);
};

const dqsA = (cont) => {
    return document.querySelectorAll(cont);
};

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

const adminGeneralOptions = dqsA('.forAdminGeneralOptions > input');
const newUserGeneralOptions = dqsA('.forNewUserGeneralOptions > input');
// let it easy
['click', 'change', 'keyup'].map(evt => {
    newUserGeneralOptions.forEach(cont => cont.addEventListener(evt, () => {
        newUserGeneralOptions.forEach((cont, i) => {
            cont.value = adminGeneralOptions[i].value;
        });
    }))
});

// OPTION FOR ATTACH DB

let options = (cont) => {
    let options = {};
    cont.forEach(opt => {
        options[opt.title] = opt.value;
    });
    return options;
};

const forOptions = dqsA('.forOptions >*> input');

let request = {};

const compositionDB = dqs('#compositionDB > tbody');
const compositionTable = dqs('#compositionTable > tbody');

//log(options(forOptions));

dqs('#connect').addEventListener('click', async () => {
    request.options = options(forOptions);
    // log(request.options);
    if (request.options) {
        try {
            request.db = true;
            const result = await makeReq(request);
            if (result.unlogged) {
                window.location.replace('/');
            }
            else {
                compositionDB.innerHTML = '';
                showDB(compositionDB, result);
            }
        }
        catch (err) { log(err) };
    } else alert('FiLL INPUT');
});


async function getComposition(evt) {
    //log('getComposition request', request);
    compositionTable.innerHTML = '';
    //log(evt.path[0].innerText);
    request.tableName = evt.path[0].innerText;
    try {
        //request.db = true;
        request.data = false;
        const result = await makeReq(request);
        if (result.unlogged) {
            window.location.replace('/');
        }
        else {
            //log('getComposition result', result);
            showHead(compositionTable, result);
        };
    }
    catch (err) { log(err) };
};

async function getData() {
    try {
        request.data = true;
        const result = await makeReq(request);
        if (result.unlogged) {
            window.location.replace('/');
        }
        else {
            //compositionTable.innerHTML = '';
            //log('getData result', result);
            showTable(compositionTable, result);
        };
    }
    catch (err) { log(err) };
};

function showDB(context, data) {
    //log('showDB', data);
    data.map((data) => {
        data.map((data) => {
            //  log(data.replace(/\s+/g, ''));
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.textContent = data.replace(/\s+/g, '');
            td.addEventListener('click', getComposition);
            tr.appendChild(td);
            context.appendChild(tr);
        });
    });
};


function showHead(context, data) {
    //log('showHead', data);
    const tr = document.createElement('tr');
    data.map((data) => {
        data.map((data) => {
            //log(data.replace(/\s+/g, ''));
            const th = document.createElement('th');
            th.textContent = data.replace(/\s+/g, '');
            th.addEventListener('click', getData);
            tr.appendChild(th);
            context.appendChild(tr);
        });
    });
};

function showTable(context, data) {
    // log('showTable', data);
    data.map((data) => {
        const tr = document.createElement('tr');
        data.map((data) => {
            const td = document.createElement('td');
            td.textContent = data;
            tr.appendChild(td);
        });
        context.appendChild(tr);
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
        //log(result);
        return result;
    }
    catch (err) { 'fetch ERROR', log(err) };
};


dqs('#addUser').addEventListener('click', async () => {
    let newUserData = options(dqsA('.userData >*> input'));

    // log('userData', newUserData)
    makeReqAddUser(newUserData);
    // makeReqAddUserToFirebird(options);
});


let makeReqAddUser = async (request) => {
    //log(request);
    try {
        const rawResponse = await fetch('http://localhost:3000/api/apidbusers', {
            method: 'POST',
            headers,
            body: JSON.stringify({ request })
        });
        const result = await rawResponse.json();
        //log(result);
        return result;
    }
    catch (err) { 'fetch ERROR', log(err) };
    request.addUser = true;
    makeReq(request);

};
