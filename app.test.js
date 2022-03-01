
/**
 * @jest-environment jsdom
 */

const request = require('supertest');
const app = require('./app');
describe('Test GET routes', () => {
    test('GET /entrances succeeds', async () => {
        
        const res = await request(app)
        .get('/entrances')
        expect(res.statusCode).toBe(200)
    });

    test('GET /entrances returns JSON', async () => {
        const res = await request(app)
	    .get('/entrances')
	    expect(res.headers['content-type'].includes("application/json")).toBe(true)
    });

    test('GET /rooms succeeds', async () => {
        const res = await request(app)
	    .get('/rooms')
	    expect(res.statusCode).toBe(200)
    });

    test('GET /rooms returns JSON', async () => {
        const res = await request(app)
	    .get('/rooms')
	    expect(res.headers['content-type'].includes("application/json")).toBe(true)
    });

    test('GET /rooms/drawing succeeds', async() => {
        const res = await request(app)
        .get('/rooms/drawing')
        expect(res.statusCode).toBe(200)
    });

    test('GET /rooms/drawing returns JSON', async() => {
        const res = await request(app)
	    .get('/rooms/drawing')
	    expect(res.headers['content-type'].includes("application/json")).toBe(true)
    });

    test('GET /rooms/listinfo succeeds', async() => {
        const res = await request(app)
        .get('/rooms/listinfo')
        expect(res.statusCode).toBe(200)
    });

    test('GET /rooms/listinfo returns JSON', async() => {
        const res = await request(app)
	    .get('/rooms/listinfo')
        
	    expect(res.headers['content-type'].includes("application/json")).toBe(true)
    });

    test('GET /rooms/popupinfo/r0 succeeds', async () => {
        const res = await request(app)
        .get('/rooms/popupinfo/r0')
        expect(res.statusCode).toBe(200)
    });

    test('GET /rooms/popupinfo/r0 returns json', async () => {
        const res = await request(app)
	    .get('/rooms/popupinfo/r0')
	    expect(res.headers['content-type'].includes("application/json")).toBe(true)
    });

    test('GET /buildings succeeds', async () => {
        const res = await request(app)
        .get('/buildings')
        expect(res.statusCode).toBe(200)
    });

    test('GET /buildings returns JSON', async () => {
        const res = await request(app)
	    .get('/buildings')
	    expect(res.headers['content-type'].includes("application/json")).toBe(true)
    });

    test('GET /corridors succeeds', async () => {
        const res = await request(app)
        .get('/corridors')
        expect(res.statusCode).toBe(200)
    });

    test('GET /corridors returns JSON', async () => {
        const res = await request(app)
	    .get('/corridors')
	    expect(res.headers['content-type'].includes("application/json")).toBe(true)
    });

    test('GET /unmarkedRooms succeeds', async () => {
        const res = await request(app)
        .get('/unmarkedRooms')
        expect(res.statusCode).toBe(200)
    });

    test('GET /unmarkedRooms returns JSON', async () => {
        const res = await request(app)
	    .get('/unmarkedRooms')
	    expect(res.headers['content-type'].includes("application/json")).toBe(true)
    });
});

describe('Test POST routes', () => {
    test('POST /entities/add succeeds', async () => {
        const params = {
            name: "New room",
            category: "unmarkedRoom",
            level: "1",
            building: "west block"
          };
        const res = await request(app)
	    .post('/entities/add')
        .send(params)
	    expect(res.statusCode).toBe(201)
    });

    test('POST /entities/add fails', async () => {
        const params = {
            name: "New room",
            category: "unmarkedRoom",
            level: "1"
          };
        const res = await request(app)
	    .post('/entities/add')
        .send(params)
	    expect(res.statusCode).toBe(400)
    });

    // test('POST /entities/edit succeeds', () => {
    //     const params =  {
    //         IdOfEdit: rooms[rooms.length - 1].id,
    //         category: "room",
    //         property: "name",
    //         editNewValue: "Different name"
    //       };
    //     return request(app)
	//     .post('/entities/edit')
    //     .send(params)
	//     .expect(201);
    // });

    // test('POST /entities/delete succeeds, archive mode', () => {
    //     const params =  {
    //         IdOfDelete: rooms[rooms.length - 1].id,
    //         deleteType: "archive"
    //       };
    //     return request(app)
	//     .post('/entities/delete')
    //     .send(params)
	//     .expect(201);
    // });

    // test('POST /entities/restore succeeds', () => {
    //     const params =  {
    //         IdOfRestore: archive[archive.length - 1].id
    //       };
    //     return request(app)
	//     .post('/entities/restore')
    //     .send(params)
	//     .expect(201);
    // });

    // test('POST /entities/delete succeeds, permanent deletion', () => {
    //     const params =  {
    //         IdOfDelete: rooms[rooms.length - 1].id,
    //         deleteType: "permanent"
    //       };
    //     return request(app)
	//     .post('/entities/delete')
    //     .send(params)
	//     .expect(201);
    // });
});

module.exports = app;
