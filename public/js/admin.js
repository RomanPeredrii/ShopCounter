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

const addUser = dqs('#addUser');
const delUser = dqs('#delUser');
const roleInp = dqs('#role');
const optionsList = dqsA('.options>*')
const departmentsList = dqs('.departmentsList');
let gather = new Gather('.options', null);
const preloader = new Preloader('.messager');

let state = {};
['click', 'change', 'keyup'].map(evt => {
    optionsList.forEach((cont, i) => cont.addEventListener(evt, (evt) => {
        // log(evt);
        gather = new Gather('.options', null);
        let del =
            gather.getValues().port &&
            gather.getValues().database &&
            gather.getValues().user &&
            gather.getValues().host;
        let add =
            gather.getValues().role &&
            gather.getValues().password;
        if (del) {
            delUser.disabled = false
        } else { delUser.disabled = true };

        if (add && del) {
            addUser.disabled = false;
        } else { addUser.disabled = true };
    }))
});
// !! - 
roleInp.addEventListener('click', async(evt) => {
    try {
    gather = new Gather('.options', null);
    if (
        gather.getValues().port &&
        gather.getValues().database &&
        gather.getValues().user &&
        gather.getValues().database &&
        gather.getValues().password) {
        gather.getValues().getRoles = true;
        if (!state.rolesList) {
            const request = new Request();
            preloader.show();
            const result = await request.makeRequest('/api/apidbadmin', gather.getValues());
            if (result.unlogged) {
                window.location.replace('/');
            };
            const roles = document.createElement('div');
            dqs('.options').insertBefore(roles, departmentsList);
            roles.classList.add("roles");
            state.rolesList = true;
            roleInp.style.display = 'none';
            roles.style.display = "block";
            const rolesList = new List(result, "role", ".roles");
            preloader.hide();
            rolesList.chooseValues();
            
            roles.addEventListener('mouseup', evt => {
                roleInp.value = evt.target.innerText;
                roleInp.style.display = 'block';
                roles.remove();
                state.rolesList = false;
            });
        };
     };
    }
    catch (err) {
        const message = new ErrorMessage('.messager');
        message.show(err);
    };        
});


departmentsList.addEventListener('click', async() => {
    gather = new Gather('.options', null);
    if (
        gather.getValues().port &&
        gather.getValues().database &&
        gather.getValues().user &&
        gather.getValues().database &&
        gather.getValues().password) {
        if (!state.list) {
            gather.getValues().getDepProd = true;
            const request = new Request();
            preloader.show();
            const result = await request.makeRequest('/api/apidbadmin', gather.getValues());
            if (result.unlogged) {
                window.location.replace('/');
            };
            departmentsList.style.color = "#000000";
            const list = new List(result, "department", ".departmentsList");
            preloader.hide();
            list.chooseValues();
            state.list = true;
        };
    };
});

delUser.addEventListener('click', (evt) => {
    let gather = new Gather('.options', null);
    gather.getLocalValues().delUser = true;
    const request = new Request();
    log(gather.getLocalValues());
    // preloader.show();
    // const result = await request.makeRequest('/api/apidbadmin', gather.getValues());
    // preloader.hide();
});

addUser.addEventListener('click', (evt) => {
    let gather = new Gather('.options', null);
    gather.getValues().addUser = true;
    const request = new Request();
    log(gather.getValues());
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