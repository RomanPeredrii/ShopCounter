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

const adminGeneralOptions = document.querySelectorAll('.forAdminGeneralOptions > input');
const userGeneralOptions = document.querySelectorAll('.forNewUserGeneralOptions > input');

let options = {};

// OPTION FOR ATTACH DB
const forOptions = document.querySelectorAll('.forOptions >*> input');
log(forOptions);

forOptions.forEach(opt => {
// log(opt.title);
// log(opt.value);
options[opt.title] = opt.value;

//log(opt.data);
});




function getOptions(options) {

    return  options;
//     return {
//         options: {
//             host: optionHostDBData.value,
//             port: optionPortDBData.value,
//             database: optionPathDBData.value,
//             user: optionUserDBData.value,
//             password: optionPasswordDBData.value,
//             pageSize: optionPageSizeDBData.value,
//             role: optionRoleDBData.value
//         }

//     };
};

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

let request = {};
log(options);
document.querySelector('#connect').addEventListener('click', async () => {
    request.options = options;
    log(request.options);
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
    log('getComposition request', request);
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
            log('getComposition result', result);
            showHead(compositionTable, result);
        };
    }
    catch (err) { log(err) };
};

async function getData(evt) {
    log('getData request', request);
    //log(evt.path[0].innerText);
    //request.tableName = evt.path[0].innerText;
    try {
        request.data = true;
        const result = await makeReq(request);
        if (result.unlogged) {
            window.location.replace('/');
        }
        else {
            //compositionTable.innerHTML = '';
            log('getData result', result);
            showTable(compositionTable, result);
        };
    }
    catch (err) { log(err) };
};

function showDB(context, data) {
    log('showDB', data);
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
    log('showHead', data);
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
    log('showTable', data);
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

// scriptInput.addEventListener('keydown',async  function (evt) {
//     if (evt.key === 'Enter') {
//         termText.textContent += this.value + '\n';

//         request.script = this.value;

//         let result = await makeReq(request); log(request);
//         termText.textContent += result;
//         showTable(compositionTable, result);
//         //this.value = '';
//     };
// }.bind(scriptInput), false);

const optionsData = document.querySelectorAll('.options');

// const optionHostDBDataNewUser = document.querySelector('#optionsHostNewUser');
// const optionPortDBDataNewUser = document.querySelector('#optionsPortNewUser');
// const optionPathDBDataNewUser = document.querySelector('#optionsPathNewUser');
// const optionUserDBDataNewUser = document.querySelector('#optionsUserNewUser');
// const optionRoleDBDataNewUser = document.querySelector('#optionsRoleNewUser');
// const optionPasswordDBDataNewUser = document.querySelector('#optionsPasswordNewUser');
// const optionPageSizeDBDataNewUser = document.querySelector('#optionsPageSizeNewUser');
// const brandNewUserData = document.querySelector('#brandUserData');
// const addressNewUserData = document.querySelector('#addressUserData');

let newUserData = {};

['optionsHostNewUser', 'optionsPortNewUser', 'optionsPathNewUser',
    'optionsUserNewUser', 'optionsRoleNewUser', 'optionsPasswordNewUser',
    'optionsPageSizeNewUser', 'brandUserData', 'addressUserData']
    .map(cont => {

        newUserData[cont] = document.querySelector('#' + cont);
    });

//log(newUserData);


['click', 'change', 'keyup'].map(evt => {
    optionsData.forEach(cont => cont.addEventListener(evt, changeUserData))
});

function changeUserData() {

    // for (let i = 0)
    // optionHostDBDataNewUser.value = optionHostDBData.value;
    // optionPortDBDataNewUser.value = optionPortDBData.value;
    // optionPathDBDataNewUser.value = optionPathDBData.value;
    // optionPageSizeDBDataNewUser.value = optionPageSizeDBData.value;
};

// from-to (value)
// [
//     [newUserData, newUserDatanewUserData]
// ].map(x => {


//     x.[2]value = x[2].value
//     x.[1]value = x[1].value
//     x.[0]value = x[0].value
// })

newUserData.value

document.querySelector('#addUser').addEventListener('click', async () => {
    let options = {
        host: optionHostDBDataNewUser.value,
        port: optionPortDBDataNewUser.value,
        database: optionPathDBDataNewUser.value,
        username: optionUserDBDataNewUser.value,
        password: optionPasswordDBDataNewUser.value,
        pageSize: optionPageSizeDBDataNewUser.value,
        role: optionRoleDBDataNewUser.value,
        point: brandNewUserData.value,
        address: addressNewUserData.value
    };

    
    makeReqAddUser(options);
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
};
