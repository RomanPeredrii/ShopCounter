const test = require('ava');
const request = require('supertest');
const app = require('../src/app');
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const jwtString = require('../src/config/keys').jwtString;
// const User = require("mongoose").model('users');

test("user doesn't exist", async t => {

    const testUser = {
        username: "test22",
        password: "test2",
    };

    const response = await request(app)
        .post('/api/auth/login')
        .send(testUser);
    t.is(response.status, 404);
    t.deepEqual(response.body, {
        message: `user with name ${testUser.username} not exists` 
    });
});

test('user sign in & get token', async t => {

    const testUser = {
        username: "test2",
        password: "test2",
    };

    const response = await request(app)
        .post('/api/auth/login')
        .send(testUser);
    t.is(response.status, 200);
    t.truthy(typeof response.body.token === `string`);
    t.truthy(response.body.token.length === 208);
});

test('user attempts to sign in with wrong password', async t => {

    const testUser = {
        username: "test2",
        password: "test",
    };

    const response = await request(app)
        .post('/api/auth/login')
        .send(testUser);
    t.is(response.status, 401);
    t.deepEqual(response.body, {
        message: `password incorrect, try again`
    });
});

// test('add new user', async t => {

//     const testUser = {
//         username: "test1",
//         password: "test1",
//     };

//     const response = await request(app)
//         .post('/api/auth/register')
//         .send(testUser);
//     t.is(response.status, 200);
//     t.truthy(typeof response.body.token === `string`);
//     t.truthy(response.body.token.length === 208);
// });