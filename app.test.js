'use strict';

const request = require('supertest');
const app = require('./app');

describe('Test GET routes', () => {
    test('GET /entrances succeeds', () => {
        return request(app)
	    .get('/entrances')
	    .expect(200);
    });

    test('GET /entrances returns JSON', () => {
        return request(app)
	    .get('/entrances')
	    .expect('Content-type', /json/);
    });

    test('GET /rooms succeeds', () => {
        return request(app)
	    .get('/rooms')
	    .expect(200);
    });

    test('GET /rooms returns JSON', () => {
        return request(app)
	    .get('/rooms')
	    .expect('Content-type', /json/);
    });

    test('GET /rooms/drawing succeeds', () => {
        return request(app)
	    .get('/rooms/drawing')
	    .expect(200);
    });

    test('GET /rooms/drawing returns JSON', () => {
        return request(app)
	    .get('/rooms/drawing')
	    .expect('Content-type', /json/);
    });

    test('GET /rooms/listinfo succeeds', () => {
        return request(app)
	    .get('/rooms/listinfo')
	    .expect(200);
    });

    test('GET /rooms/listinfo returns JSON', () => {
        return request(app)
	    .get('/rooms/listinfo')
	    .expect('Content-type', /json/);
    });

    test('GET /rooms/popupinfo/r0 succeeds', () => {
        return request(app)
	    .get('/rooms/popupinfo/r0')
	    .expect(200);
    });

    test('GET /rooms/popupinfo/r0 returns text', () => {
        return request(app)
	    .get('/popupinfo/r0')
	    .expect('Content-type', /text\/html/);
    });

    test('GET /buildings succeeds', () => {
        return request(app)
	    .get('/buildings')
	    .expect(200);
    });

    test('GET /buildings returns JSON', () => {
        return request(app)
	    .get('/buildings')
	    .expect('Content-type', /json/);
    });

    test('GET /corridors succeeds', () => {
        return request(app)
	    .get('/corridors')
	    .expect(200);
    });

    test('GET /corridors returns JSON', () => {
        return request(app)
	    .get('/corridors')
	    .expect('Content-type', /json/);
    });

    test('GET /unmarkedRooms succeeds', () => {
        return request(app)
	    .get('/unmarkedRooms')
	    .expect(200);
    });

    test('GET /unmarkedRooms returns JSON', () => {
        return request(app)
	    .get('/unmarkedRooms')
	    .expect('Content-type', /json/);
    });
});

describe('Test POST routes', () => {
    test('POST /entities/add succeeds', () => {
        const params =  {
            newName: "New room",
            category: "room",
            newLocation: "53.53009502364674, -1.1114021797617966",
            newDescription: "New room at the hospital",
            newHoursWeekStart: "08:30",
            newHoursWeekEnd: "17:30",
            newHoursWeekendStart: "12:00",
            newHoursWeekendEnd: "17:30",
            newImg: "default.jpeg"
          };
        return request(app)
	    .post('/entities/add')
        .send(params)
	    .expect(201);
    });
});

module.exports = app;