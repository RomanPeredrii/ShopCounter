const test = require('ava');
const req = require('supertest')(require('../src/app'));

test('internal server error', async t => {

    const testUser = {
        username: "test1",
        password: "test1",
    };

    const response = await req
        .delete(`/api/auth/delete/${testUser.username}`)
    t.is(response.status, 500);
    t.deepEqual(response.body, {
        message: `internal server error`
    });
});


test('delete user', async t => {

    const testUser = {
        username: "test2"
    };

    const response = await req
        .delete(`/api/auth/delete/${testUser.username}`);
    t.is(response.status, 201);
    t.deepEqual(response.body, {
        message: `user ${testUser.username} deleted`
    });
});

test("user doesn't exist", async t => {

    const testUser = {
        username: "test22",
        password: "test2",
    };

    const response = await req
        .delete(`/api/auth/delete/${testUser.username}`);
    t.is(response.status, 404);
    t.deepEqual(response.body, {
        message: `user with name ${testUser.username} doesn't exist`
    });
});