// evt = event;
// cont = context;
// i = item;
// opt = option;
import { log, dqs, dqsA } from '../my_modules/stuff.js';
import Gather from '../my_modules/gather.js';
import Request from '../my_modules/request.js';
import List from '../my_modules/list.js';
import Preloader from '../my_modules/preloader.js';
import ErrorMessage from '../my_modules/errorMessage.js';
// import { getCiphers } from 'crypto';

const addUser = dqs('#addUser');
const newUser = dqs('.newUser');
const delUserB = dqs('#delUserB');
const delUser = dqs('.delUser');
const optionsList = dqsA('.options>*')
const departmentsList = dqs('.departmentsList');
const departments = dqs('#departmentsList');
const preloader = new Preloader('.messager');

let state = {
    list: false
};

['click', 'change', 'keyup'].map(evt => {
    optionsList.forEach(cont => cont.addEventListener(evt, () => {
        const gather = new Gather('.options', null);
        if (gather.getValues().host &&
            gather.getValues().port &&
            gather.getValues().database &&
            gather.getValues().user &&
            gather.getValues().password)
            delUserB.disabled = addUser.disabled = false
        else
            delUserB.disabled = addUser.disabled = true;
    }))
});


addUser.addEventListener('click', async() => {
    if (state.list) {
        const gatherOptions = new Gather('.options', null);
        const gatherNewUser = new Gather('.newUser', null);
        const gatherDepartmentsList = new Gather('.departmentsList', null);
        let req = {
            ...gatherOptions.getValues(),
            newUser: {
                ...gatherNewUser.getLocalCheckedValues(),
                departments: gatherDepartmentsList.getLocalCheckedValues()
            }
        };
        if (Object.keys(gatherOptions.getValues()) == 0 ||
            Object.keys(gatherNewUser.getLocalCheckedValues()) == 0 ||
            Object.keys(gatherDepartmentsList.getLocalCheckedValues()) == 0) { log('ERROR') } else {
            const request = new Request();
            log(req);
            // preloader.show();
            const result = await request.makeRequest('/api/apidbadmin', req);
        }
    } else
        delUserB.disabled = addUser.disabled = true;
    // preloader.show();
    const gather = new Gather('.options', null);
    gather.getValues().checkConnection = true;
    // const request = new Request();
    optionsList.forEach(cont => cont.disabled = true);
    newUser.style.display = 'block';

    // const result = await request.makeRequest('/api/apidbadmin', gather.getValues());
    // preloader.hide();
});

departments.addEventListener('click', async() => {
    const gather = new Gather('.options', null);
    if (
        gather.getValues().host &&
        gather.getValues().port &&
        gather.getValues().database &&
        gather.getValues().user &&
        gather.getValues().password) {
        if (!state.list) {
            departments.disabled = true;
            preloader.show();
            gather.getValues().getDepProd = true;
            const request = new Request();
            const result = await request.makeRequest('/api/apidbadmin', gather.getValues());
            if (result.unlogged) {
                window.location.replace('/');
            };
            preloader.hide();
            departments.style.display = 'none';
            departmentsList.style.display = 'block';
            const list = new List(result, "department", ".departmentsList");
            list.showCheckboxList();
            checkFillingInputs();
            state.list = true;
        };
    };
});


let checkFillingInputs = () => {
    dqsA('.newUser').forEach(cont => {
        ['click', 'change', 'keyup'].map(evt => {
            cont.addEventListener(evt, () => {
                const gatherNewUser = new Gather('.newUser', null);
                const gatherDepartmentsList = new Gather('.departmentsList', null);
                if (
                    (!gatherNewUser.getCheckedValues().newUser ||
                        (gatherNewUser.getCheckedValues().newUser.trim() === '')) ||
                    (!gatherNewUser.getCheckedValues().newUserPassword ||
                        (gatherNewUser.getCheckedValues().newUserPassword.trim() === '')) ||
                    (Object.keys(gatherDepartmentsList.getLocalCheckedValues()) == 0))
                    addUser.disabled = true;
                else addUser.disabled = false;
            })
        })
    })
};


delUserB.addEventListener('click', async() => {
    delUser.style.display = 'block';
    delUserB.disabled = addUser.disabled = true;
    optionsList.forEach(cont => cont.disabled = true);
    const gatherOptions = new Gather('.options', null);
    const gatherDelUser = new Gather('.delUser', null);
    dqs('#delUser').addEventListener('keyup', () => {
        const gatherDelUser = new Gather('.delUser', null);
        if (!(Object.keys(gatherOptions.getValues()) == 0) &&
            ((!gatherDelUser.getValues().delUser) ||
                (gatherDelUser.getValues().delUser.trim() === '')))
            delUserB.disabled = true
        else delUserB.disabled = false;
    });
    let req = {
        ...gatherOptions.getValues(),
        ...gatherDelUser.getValues() ? gatherDelUser.getValues() : false
    };
    const request = new Request();
    log(req);
    // preloader.show();
    const result = await request.makeRequest('/api/apidbadmin', req);


    // gather.logD();
    // gather.getLocalValues().delUser = true;

    // const request = new Request();
    // log(gather.getLocalValues());
    // preloader.show();
    // const result = await request.makeRequest('/api/apidbadmin', gather.getValues());
    // preloader.hide();
});
















// request.tableName = 'PRODUCTS';
// request.products = true;
// request.addUser = false;
// request.db = false;
// request.options = false;
// request.adminOptions = options(forOptions);
// try {
//     request.data = true;
//     const result = await makeReq(request);
//     if (result.unlogged) {
//         window.location.replace('/');
//     } else {
//         dList.style.display = 'inline-block';
//         drList = new DropList(evt.target, result);
//     };
// } catch (err) { log(err) };



















// let it easy
// const dqs = (cont) => {
//     return document.querySelector(cont);
// };
// const dqsA = (cont) => {
//     return document.querySelectorAll(cont);
// };

// const headers = {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json'
// };
//const compositionTableMenu = dqs('.compositionTableMenu');
//const adminGeneralOptions = dqsA('.forAdminGeneralOptions > input');
//const newUserGeneralOptions = dqsA('.forNewUserGeneralOptions > input');
//const doubleSlider = dqs('.dSlider');


// !! - hung up array of event listeners
// ['click', 'change', 'keyup'].map(evt => {
//     newUserGeneralOptions.forEach(cont => cont.addEventListener(evt, () => {
//         newUserGeneralOptions.forEach((cont, i) => {
//             // !! - trow options from admin into newUser div
//             cont.value = adminGeneralOptions[i].value;
//         });
//     }))
// });

// let dsr = null;



// OPTION FOR ATTACH DB

// // !! - collect options 
// let options = (cont) => {
//     let options = {};
//     cont.forEach(opt => {
//         options[opt.title] = opt.value;
//     });
//     return options;
// };

//const forOptions = dqsA('.forOptions >*> input');

// !! - request map have to be filled for default options
//let request = {};

//const compositionDB = dqs('#compositionDB > tbody');
//const compositionTable = dqs('#compositionTable > tbody');


// !! - check connection to db
// dqs('#connect').addEventListener('click', async () => {
//     request.options = options(forOptions);
//     if (request.options) {
//         try {
//             request.db = true;
//             const result = await makeReq(request);
//             // !! - relocate if token 
//             if (result.unlogged) {
//                 window.location.replace('/');
//             }
//         }
//         catch (err) { log(err) };
//     } else alert('FiLL INPUT');

// });



// !! - request to firebird
// let makeReq = async (request) => {
//     try {
//         const rawResponse = await fetch('/api/apidbadmin', {
//             method: 'POST',
//             headers,
//             body: JSON.stringify({ request })
//         });
//         const result = await rawResponse.json();
//         return result;
//     }
//     catch (err) { log('fetch ERROR', err) };
// };


// !! - make new user
// dqs('#addUser').addEventListener('click', async () => {
//     const gather = new Gather('.userData',{});
//     let newUserData = options(dqsA('.userData >*> input'));
//     makeReqAddUser(newUserData);
//     const filledNewUserDataInputs = await new Promise((res, rej) => {
// // check input value

//         dqsA('.userData >*> input').forEach((input) => {
//             log(input); 
//             if (input.value.length < 2) {
//                 res = false; log('1', input.value.length, res);
//             }
//             else
//                 res = true; log('2', input.value.length, res);
//         })
//     });

// if (!filledNewUserDataInputs) {
//     alert('YOU HAVE TO FILL ALL FIELDS');
//    makeReqAddUser(newUserData);
// } else {

// }
//log(typeof filledNewUserDataInputs, filledNewUserDataInputs);
// });


// !! - request add user to mongo & firebird
// let makeReqAddUser = async (newUserData) => {
//     request.options = newUserData;
//     request.tableName = false;
//     request.addUser = true;
//     request.db = false;
//     request.products = false;
//     request.adminOptions = options(forOptions);
//     log('makeReqAddUser REQUEST ', request);
//     //makeReq(request);
//     try {
//         const rawResponse = await fetch('/api/apidbusers', {
//             method: 'POST',
//             headers,
//             body: JSON.stringify({ request })
//         });
//         const result = await rawResponse.json();
//         return result;
//     }
//     catch (err) { 'fetch ERROR', log(err) };
// };
// request.tableField = false;


// 
// let drList;
// let drListWithCheck;
// let arrPRODID = [];
// const dList = dqs('.drList');

// const productsUserData = dqs('#productsUserData');
// const departmentUserData = dqs('#departmentUserData');
// const countersUserData = dqs('#countersUserData');



// !! - 
// productsUserData.addEventListener('click', async (evt) => {
//     request.tableName = 'PRODUCTS';
//     request.products = true;
//     request.addUser = false;
//     request.db = false;
//     request.options = false;
//     request.adminOptions = options(forOptions);
//     try {
//         request.data = true;
//         const result = await makeReq(request);
//         if (result.unlogged) {
//             window.location.replace('/');
//         }
//         else {
//             dList.style.display = 'inline-block';
//             drList = new DropList(evt.target, result);
//         };
//     }
//     catch (err) { log(err) };
// });

// !! - built drop list & get products
// departmentUserData.addEventListener('click', async (evt) => {
//     if (productsUserData.value) {
//         request.tableName = 'COUNTERLIST';
//         request.products = productsUserData.value;
//         request.addUser = false;
//         request.db = false;
//         request.options = false;
//         request.adminOptions = options(forOptions);
//         try {
//             request.data = true;
//             const result = await makeReq(request);
//             if (result.unlogged) {
//                 window.location.replace('/');
//             }
//             else {
//                 dList.style.display = 'inline-block';
//                 drListWithCheck = new DropListWithCheck(evt.target, result);
//                 evt = null;
//             };
//         }
//         catch (err) { log(err) };
//     }
//     else {
//         alert("PRODUCTS FIRST");
//     };
// });


// !! - built drop list with check  & get departments
// countersUserData.addEventListener('click', async (evt) => {
//     if (departmentUserData.value) {
//         request.tableName = 'DEPARTMENT';
//         request.department = departmentUserData.value;
//         request.addUser = false;
//         request.db = false;
//         request.options = false;
//         request.adminOptions = options(forOptions);
//         try {
//             request.data = true;
//             const result = await makeReq(request);
//             if (result.unlogged) {
//                 window.location.replace('/');
//             }
//             else {
//                 result.forEach((res) => {
//                     if (countersUserData.value.indexOf(res[0].replace(/\s+/g, ';'), 0) === -1) {
//                         log(countersUserData.value.indexOf(res[0], 0));
//                         countersUserData.value += res[0].replace(/\s+/g, ';')
//                     };

//                 });
//             };
//         }
//         catch (err) { log(err) };
//     }
//     else {
//         alert("PRODUCTS => DEPARTMENT => COUNTERLIST");
//     };
// });0000