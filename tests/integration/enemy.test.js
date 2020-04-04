const request = require('supertest');
const { Enemy } = require('../../models/enemyModel');
const { User } = require('../../models/userModel');

let server;

describe('enemy', () => {
    beforeEach(() => { 
        server = require('../../index'); 
    });

    afterEach(async () => {
        await Enemy.deleteMany({});
        server.close();
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
    });

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
        let token;
        let name;

        const postrequest = async () => {
            return await request(server)
                .post('/enemies/')
                .set('x-auth-token', token)
                .send({ name });
        };

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'obivan';
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await postrequest();
            expect(res.status).toBe(401);
        });

        it('should return 400 if data name less than 3 characters', async () => {
            name = '12';
            const res = await postrequest();
            expect(res.status).toBe(400);
        });

        it('should return 400 if data name more than 50 characters', async () => {
            name = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation";

            const res = await postrequest();

            expect(res.status).toBe(400);
        });

        it('should save enemy if valid', async () => {
            await postrequest();
            const enemy = await Enemy.find({ name: 'obivan' });
            expect(enemy).not.toBeNull();
        });

        it('should save enemy if valid', async () => {
            const res = await postrequest();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'obivan');
        });
    });
});