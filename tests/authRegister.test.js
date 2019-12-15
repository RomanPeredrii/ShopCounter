const test = require('ava');
const req = require('supertest')(require('../src/app'));

test('add new user', async t => {

    const testUser = {
        username: "test2",
        password: "test2"
    };

    const response = await req
        .post('/api/auth/register')
        .send(testUser);
    t.is(response.status, 201);
    t.truthy(typeof response.body.message === "object");
});


test('try to dublicate user', async t => {

    const testUser = {
        username: "test2",
        password: "test2",
    };

    const response = await req
        .post('/api/auth/register')
        .send(testUser);
    t.is(response.status, 409);
    t.deepEqual(response.body, {
        message: `user with name ${testUser.username} doesn't exist`
    });
});

test('internal server error', async t => {
    
    const testUser = {
        username: "test1",
        password: "test1",
    };

    const response = await req
        .post('/api/auth/register')
        .send(testUser);
    t.is(response.status, 500);
    t.deepEqual(response.body, {
        message: `internal server error`
    });
});