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
import WarningMessage from '../my_modules/warningMessage.js';
import InformationMessage from '../my_modules/warningMessage.js';

import adminOptions from './check.js';
// import { getCiphers } from 'crypto';

const addUser = dqs('#addUser');
const newUser = dqs('.newUser');
const delUserB = dqs('#delUserB');
const delUser = dqs('.delUser');
const optionsList = dqsA('.options>*')
const departmentsList = dqs('.departmentsList');
const departments = dqs('#departmentsList');
const preloader = new Preloader('.messager');
// const errorMessage = new ErrorMessage;
// const warningMessage = new WarningMessage;
// const informationMessage = new InformationMessage;

let state = {
    list: false
};

['click', 'change', 'keyup'].map(evt => {
    optionsList.forEach(cont => cont.addEventListener(evt, () => {
        const gather = new Gather('.options', adminOptions);
        log(gather.getValues());
        if (gather.getValues().host &&
            gather.getValues().port &&
            gather.getValues().database &&
            gather.getValues().user &&
            gather.getValues().password) {
            delUserB.disabled = addUser.disabled = false;

        } else
            delUserB.disabled = addUser.disabled = false;
    }))
});


addUser.addEventListener('click', async() => {
    if (state.list) {
        const gatherOptions = new Gather('.options', adminOptions);
        const gatherNewUser = new Gather('.newUser', null);
        const gatherDepartmentsList = new Gather('.departmentsList', null);
        log(gatherOptions.getValues());
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
    const gather = new Gather('.options', adminOptions);
    log(gather.getValues());
    gather.getValues().checkConnection = true;
    // const request = new Request();
    optionsList.forEach(cont => cont.disabled = true);
    newUser.style.display = 'block';

    // const result = await request.makeRequest('/api/apidbadmin', gather.getValues());
    // preloader.hide();
});

departments.addEventListener('click', async() => {
    const gather = new Gather('.options', adminOptions);

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
            log(gather.getValues());
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
    // preloader.show();
    const result = await request.makeRequest('/api/apidbadmin', req);
    if (result.error) {
        log(result.error);

    } else {
        log(result.username, 'DELETED');

    }
});