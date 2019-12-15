const test = require('ava');
const req = require('supertest')(require('../src/app'));

test('App works', async t => {

    const response = await req
        .get('/')
    t.is(response.status, 200);
    t.deepEqual(response.body, {
        message: `ok!`
    });

});