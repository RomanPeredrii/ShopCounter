// evt = event;
// cont = context;
// i = item;
// opt = option;

"use strict"

const log = console.log;

// let it easy
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
const compositionTableMenu = dqs('.compositionTableMenu');
const adminGeneralOptions = dqsA('.forAdminGeneralOptions > input');
const newUserGeneralOptions = dqsA('.forNewUserGeneralOptions > input');
const doubleSlider = dqs('.dSlider');


// !! - hung up array of event listeners
['click', 'change', 'keyup'].map(evt => {
    newUserGeneralOptions.forEach(cont => cont.addEventListener(evt, () => {
        newUserGeneralOptions.forEach((cont, i) => {
            // !! - trow options from admin into newUser div
            cont.value = adminGeneralOptions[i].value;
        });
    }))
});

let dsr = null;

//log(adminGeneralOptions);
// let request = {
//         db : false,
//         data: false,
//         tableName: false,    
// };

// OPTION FOR ATTACH DB

// !! - collect options 
let options = (cont) => {
    let options = {};
    cont.forEach(opt => {
        options[opt.title] = opt.value;
    });
    return options;
};

const forOptions = dqsA('.forOptions >*> input');

// !! - request map have to be filled for default options
let request = {
};

const compositionDB = dqs('#compositionDB > tbody');
const compositionTable = dqs('#compositionTable > tbody');


// !! - check connection to db
dqs('#connect').addEventListener('click', async () => {
    request.options = options(forOptions);
    if (request.options) {
        try {
            request.db = true;
            const result = await makeReq(request);
// !! - relocate if token 
            if (result.unlogged) {
                window.location.replace('/');
            }
            else {
//!! - get list of tables
                compositionDB.innerHTML = '';
                showDB(compositionDB, result);
            }
        }
        catch (err) { log(err) };
    } else alert('FiLL INPUT');

});

// !! - get head of table
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
// !! - get data of table 
async function getData(evt) {
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

    // if (evt.target.childNodes[0].data === 'TIMEPOINT') {
    //     compositionTableMenu.setAttribute('style', `position: fixed; left: ${evt.clientX}px; top: calc(
    //     ${evt.clientY}px - 20px); display: inline-block; border: 1px solid #999; background : #f1eded; `);
    // };
    // else {
    //     doubleSlider.setAttribute('style', `position: absolute; display: flex;
    // left: ${evt.clientX}px; top: calc(${evt.clientY}px - 20px); display: inline-block; z-index: 11`);

    //     log(makeReqGetMaxCount(evt));
    //     dsr = new Dslider('.dSlider', '5em', 0, 100, 1);
    // };
    // else if (evt.target.childNodes[0].data === ('SERIAL' || 'CH1' || 'CH2' || 'TIMECALC' || 'TIMEOFF')) {

    //     compositionTableMenu.setAttribute('style', `position: fixed; left: ${evt.clientX}px; top: calc(
    //         ${evt.clientY}px - 20px); display: inline-block; border: 1px solid #999; background : #f1eded; `);
    //         compositionTableMenu.innerHTML = '';
    //     let inp = document.createElement('input');
    //     inp.type = 'range';
    //     //inp.innerHTML = ``;
    //     compositionTableMenu.appendChild(inp);
    // };
};

// dqs('.view').addEventListener('mouseover', () => {
//     compositionTableMenu.style.display = 'none'
// });


// !! - build table list
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

// !! - build head
function showHead(context, data) {
    const tr = document.createElement('tr');
    data.map((data) => {
        data.map((data) => {
            const th = document.createElement('th');
            th.textContent = data.replace(/\s+/g, '');
            th.addEventListener('click', /* makeReqGetMaxCount */ getData);
            tr.appendChild(th);
            context.appendChild(tr);
        });
    });
};

// !! - build data table 
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
    linksOnCompositionTableTd.forEach((td, i) => {
        let thWidth = window.getComputedStyle(linksOnCompositionHeadTableTd[i], null).width.replace('px', '');
        let tdWidth = window.getComputedStyle(td, null).width.replace('px', '');
        let width = (+tdWidth > +thWidth) ? tdWidth : thWidth;
        td.setAttribute('style', `width : ${width}px`);
        linksOnCompositionHeadTableTd[i].setAttribute('style', `width : ${width}px`);
    })
};

// !! - request to firebird
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

 // !! - make new user
dqs('#addUser').addEventListener('click', async () => {
    let newUserData = options(dqsA('.userData >*> input'));
    makeReqAddUser(newUserData);
});


// !! - request add user to mongo & firebird
let makeReqAddUser = async (newUserData) => {
    request.options = newUserData;
    request.tableName = false;
    request.addUser = true;
    request.db = false;
    request.products = false;
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
request.tableField = false;


// !! - double slider build & get dada 
// let makeReqGetMaxCount = async (evt) => {
//     log(dsr);

//     if (!dsr) {
//         request.tableField = evt.target.childNodes[0].data;
//         request.addUser = false;
//         request.db = false;
//         request.options = false;
//         request.adminOptions = options(forOptions);
//         doubleSlider.setAttribute('style', `position: absolute; display: flex;
//     left: ${evt.clientX + 10}px; top: calc(${evt.clientY - 10}px - 20px); display: inline-block; z-index: 11`);
//         dsr = new Dslider('.dSlider', '5em', 0, (await (makeReq(request)))[0][0], 1);
//     }
//     else if (dsr) {
//         log(+dsr.minValue, +dsr.maxValue);
//         log(dsr.base);
//         dsr.base.remove();
//         dsr = null;
//         getData(evt);
//     };
// };


// 
let drList;
let drListWithCheck;
let arrPRODID = [];
const dList = dqs('.drList');

const productsUserData = dqs('#productsUserData');
const departmentUserData = dqs('#departmentUserData');
const countersUserData = dqs('#countersUserData');



// !! - 
productsUserData.addEventListener('click', async (evt) => {
    request.tableName = 'PRODUCTS';
    request.products = true;
    request.addUser = false;
    request.db = false;
    request.options = false;
    request.adminOptions = options(forOptions);
    try {
        request.data = true;
        const result = await makeReq(request);
        if (result.unlogged) {
            window.location.replace('/');
        }
        else {
            dList.style.display = 'inline-block';
            drList = new DropList(evt.target, result);
        };
    }
    catch (err) { log(err) };
});

// !! - built drop list & get products
departmentUserData.addEventListener('click', async (evt) => {
    if (productsUserData.value) {
        request.tableName = 'COUNTERLIST';
        request.products = productsUserData.value;
        request.addUser = false;
        request.db = false;
        request.options = false;
        request.adminOptions = options(forOptions);
        try {
            request.data = true;
            const result = await makeReq(request);
            if (result.unlogged) {
                window.location.replace('/');
            }
            else {
                dList.style.display = 'inline-block';
                drListWithCheck = new DropListWithCheck(evt.target, result);
                evt = null;
            };
        }
        catch (err) { log(err) };
    }
    else {
        alert("PRODUCTS FIRST");
    };
});


// !! - built drop list with check  & get departments
countersUserData.addEventListener('click', async (evt) => {
    if (departmentUserData.value) {
        request.tableName = 'DEPARTMENT';
        request.department = departmentUserData.value;
        request.addUser = false;
        request.db = false;
        request.options = false;
        request.adminOptions = options(forOptions);
        try {
            request.data = true;
            const result = await makeReq(request);
            if (result.unlogged) {
                window.location.replace('/');
            }
            else {
                result.forEach((res) => {
                    if (countersUserData.value.indexOf(res[0].replace(/\s+/g, ';'), 0) === -1) {
                        log(countersUserData.value.indexOf(res[0], 0));
                        countersUserData.value += res[0].replace(/\s+/g, ';')
                    };

                });
            };
        }
        catch (err) { log(err) };
    }
    else {
        alert("PRODUCTS => DEPARTMENT => COUNTERLIST");
    };
});

