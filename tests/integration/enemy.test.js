const request = require('supertest');
const { Enemy } = require('../../models/enemyModel');
const { User } = require('../../models/userModel');

let server;

describe('enemy', () => {
    beforeEach(() => { server = require('../../index'); })
    afterEach(async () => {
        server.close();
        await Enemy.remove({});
    });
    describe('GET /', () => {
        it('should return all enemies', async () => {
            await Enemy.collection.insertMany([
                { name: 'obivan' },
                { name: 'darth maul' },
            ]);

            const res = await request(server).get('/enemies');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(enemy => enemy.name === 'obivan')).toBeTruthy();
            expect(res.body.some(enemy => enemy.name === 'darth maul')).toBeTruthy();
        });
    })
    describe('GET /:id', () => {
        it('should return enemy if valid id passed', async () => {
            const enemy = new Enemy({ name: 'obivan' });
            await enemy.save();

            const res = await request(server).get('/enemies/' + enemy._id);

            expect(res.status).toBe(200);
            expect(res.text).toMatch(`VADER MURDERED ENEMY ${enemy.name}`);

        });
        it('should return 404 if invalid id passed', async () => {
            const res = await request(server).get('/enemies/1');

            expect(res.status).toBe(404);
        });
    });
    describe('POST /', () => {
        it('should return 401 if client is not logged in', async () => {
            const res = await request(server)
                .post('/enemies/')
                .send({ name: 'obivan' });

            expect(res.status).toBe(401);
        });
        it('should return 400 if data name less than 3 characters', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post('/enemies/')
                .set('x-auth-token', token)
                .send({ name: '11' });

            expect(res.status).toBe(400);
        });
        it('should return 400 if data name more than 50 characters', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post('/enemies/')
                .set('x-auth-token', token)
                .send({ name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation" });

            expect(res.status).toBe(400);
        });
        it('should save enemy if valid', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post('/enemies/')
                .set('x-auth-token', token)
                .send({ name: 'obivan' });

            const enemy = await Enemy.find({ name: 'obivan' });
            expect(enemy).not.toBeNull();
        });
        it('should save enemy if valid', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post('/enemies/')
                .set('x-auth-token', token)
                .send({ name: 'obivan' });

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'obivan');
        });
    });
});