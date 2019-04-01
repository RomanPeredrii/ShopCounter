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

// let request = {
//         db : false,
//         data: false,
//         tableName: false,    
// };

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

dqs('#connect').addEventListener('click', async () => {
    request.options = options(forOptions);
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
    dqs('.viewHead ').style.display = 'inline-block';
    dqs('.viewTable ').style.display = 'inline-block';
    compositionHeadTable.innerHTML = '';
    compositionTable.innerHTML = '';
    dqsA('#compositionDB > tbody > tr > td')
        .forEach(td => td.setAttribute('style', 'border = 1px solid #999; background : #f1eded;'));
    evt.target.style.background = '#ffffff';

    evt.target.setAttribute('style', ' border-bottom : 0; background : #ffffff;');
    request.tableName = evt.target.childNodes[0].data;
    try {
        //request.db = true;
        request.data = false;
        const result = await makeReq(request);
        if (result.unlogged) {
            window.location.replace('/');
        }
        else {
            showHead(compositionHeadTable, result);
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
            showTable(compositionTable, result);
        };
    }
    catch (err) { log(err) };
};

function showDB(context, data) {
    compositionTable.innerHTML = '';
    const tr = document.createElement('tr');
    context.appendChild(tr);

    data.map((data) => {
        data.map((data) => {
            const td = document.createElement('td');
            td.textContent = data.replace(/\s+/g, '');
            td.addEventListener('click', getComposition);
            tr.appendChild(td);
        });
    });
};

function showHead(context, data) {
    const tr = document.createElement('tr');
    data.map((data) => {
        data.map((data) => {
            const th = document.createElement('th');
            th.textContent = data.replace(/\s+/g, '');
            th.addEventListener('click', getData);
            tr.appendChild(th);
            context.appendChild(tr);
        });
    });
};

function showTable(context, data) {

    compositionTable.innerHTML = '';

    data.map((data) => {
        const tr = document.createElement('tr');
        data.map((data) => {
            const td = document.createElement('td');
            td.textContent = data;
            tr.appendChild(td);
        });
        context.appendChild(tr);
    });

    let linksOnCompositionTableTd = dqsA('#compositionTable > tbody > tr:nth-child(1) > td');
    let linksOnCompositionHeadTableTd = dqsA('#compositionHeadTable > tr > th');

    // for (let t = 0; t < linksOnCompositionTableTd.length; t++) {
    linksOnCompositionTableTd.forEach( (td, i) => {
        let thWidth = window.getComputedStyle(linksOnCompositionHeadTableTd[i], null).width.replace('px', '');
        let tdWidth = window.getComputedStyle(td, null).width.replace('px', '');
        let width = (+tdWidth > +thWidth) ? tdWidth : thWidth;
        td.setAttribute('style', ' width : ' + width + 'px');
        linksOnCompositionHeadTableTd[i].setAttribute('style', ' width : ' + width + 'px');
    })


    //};
};

let makeReq = async (request) => {
    try {
        const rawResponse = await fetch('http://localhost:3000/api/apidbadmin', {
            method: 'POST',
            headers,
            body: JSON.stringify({ request })
        });
        const result = await rawResponse.json();
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


let makeReqAddUser = async (newUserData) => {
    request.options = newUserData;
    request.addUser = true;
    request.db = false;
    request.adminOptions = options(forOptions);
    log('makeReqAddUser REQUEST', request);
    makeReq(request);
    try {
        const rawResponse = await fetch('http://localhost:3000/api/apidbusers', {
            method: 'POST',
            headers,
            body: JSON.stringify({ request })
        });
        const result = await rawResponse.json();
        return result;
    }
    catch (err) { 'fetch ERROR', log(err) };
};
