const request = require('supertest');
const { Enemy } = require('../../models/enemyModel');
const { User } = require('../../models/userModel');

describe('Auth middleware', () => {
    let token;
    
    beforeEach(() => {
        server = require('../../index');
        token = new User().generateAuthToken();
    });
    
    afterEach(async () => {
        await Enemy.deleteMany({});
        server.close();
    });
    
    
    const postrequest = () => {
        return request(server)
            .post('/enemies/')
            .set('x-auth-token', token)
            .send({ name: 'obivan' });
    };

    it('should return 401 if no token provided', async () => {
        token = '';
        const res = await postrequest();
        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
        token = 'invalid token';
        const res = await postrequest();
        expect(res.status).toBe(400);
    });
})