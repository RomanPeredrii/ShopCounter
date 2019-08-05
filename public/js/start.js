import { log, dqs } from '../my_modules/stuff.js';
import Gather from '../my_modules/gather.js';
import Request from '../my_modules/request.js';

// !! - make query for get next page according to name&pswd
dqs('#submitButton').addEventListener('click', async() => {
    const gather = new Gather('main');
    if (!dqs('#accept').checked) alert("DON'T YOU AGREE LEGAL TERMS?")
    else {
        try {
            const request = new Request();
            const result = await request.makeRequest('/api/login', gather.getCheckedValues());
            if (result.error) alert('USER OR PASSWORD INCORRECT');
            else if (result.admin) window.location.replace('/pages/admin');
            else if (result.ok) window.location.replace('/pages/work');
        } catch (err) { log(err) };
    };
});