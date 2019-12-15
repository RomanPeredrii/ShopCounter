const test = require('ava');
const req = require('supertest')(require('../src/app'));

// test('internal server error', async t => {
    
//     const testUser = {
//         username: "test1",
//         password: "test1",
//     };

//     const response = await req
//         .post('/api/auth/login')
//         .send(testUser);
//     t.is(response.status, 500);
//     t.deepEqual(response.body, {
//         message: `internal server error`
//     });
// });


test("user doesn't exist", async t => {

    const testUser = {
        username: "test22",
        password: "test2",
    };

    const response = await req
        .post('/api/auth/login')
        .send(testUser);
    t.is(response.status, 404);
    t.deepEqual(response.body, {
        message: `user with name ${testUser.username} doesn't exist` 
    });
});

// test('user sign in & get token', async t => {

//     const testUser = {
//         username: "test2",
//         password: "test2",
//     };

//     const response = await req
//         .post('/api/auth/login')
//         .send(testUser);
//     t.is(response.status, 200);
//     t.truthy(typeof response.body.token === `string`);
//     t.truthy(response.body.token.length === 208);
// });

// test('user attempts to sign in with wrong password', async t => {

//     const testUser = {
//         username: "test2",
//         password: "test",
//     };

//     const response = await req
//         .post('/api/auth/login')
//         .send(testUser);
//     t.is(response.status, 401);
//     t.deepEqual(response.body, {
//         message: `password incorrect, try again`
//     });
// });

// test('try to dublicate user', async t => {

//     const testUser = {
//         username: "test2",
//         password: "test2",
//     };

//     const response = await req
//         .post('/api/auth/register')
//         .send(testUser);
//     t.is(response.status, 409);
//     t.deepEqual(response.body, {
//         message: `user with name ${testUser.username} doesn't exist`
//     });
// });

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