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
//const doubleSlider = dqs('.dSlider');


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
        }
        catch (err) { log(err) };
    } else alert('FiLL INPUT');

});

// !! - request to firebird
let makeReq = async (request) => {
    try {
        const rawResponse = await fetch('/api/apidbadmin', {
            method: 'POST',
            headers,
            body: JSON.stringify({ request })
        });
        const result = await rawResponse.json();
        return result;
    }
    catch (err) { log('fetch ERROR', err) };
};

// !! - make new user
dqs('#addUser').addEventListener('click', async () => {
    let newUserData = options(dqsA('.userData >*> input'));

    const filledNewUserDataInputs = await new Promise((res, rej) => {

        dqsA('.userData >*> input').forEach((input) => {
            if (input.value.length < 2) {
                res = false; log('1', input.value.length, res);
            }
            else
                res = true; log('2', input.value.length, res);
        })
    });
    
    // if (!filledNewUserDataInputs) {
    //     alert('YOU HAVE TO FILL ALL FIELDS');
    //     //makeReqAddUser(newUserData);
    // } else {

    // }
    log(typeof filledNewUserDataInputs, filledNewUserDataInputs);
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
        const rawResponse = await fetch('/api/apidbusers', {
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

