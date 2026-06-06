const request = require('supertest');
const app = require('../../app');
const { sequelize, User } = require('../../models');

const USER = {
  name: 'Auth Integration User',
  email: 'auth_integration@jager.ee',
  password: 'integrationpass123',
  age: 28,
  hasGunLicense: false,
};

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync();
});

afterAll(async () => {
  await User.destroy({ where: { email: USER.email } });
  await sequelize.close();
});

describe('Auth flow: register → login → profile', () => {
  let token;

  test('register creates a new account', async () => {
    const res = await request(app).post('/api/auth/register').send(USER);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(USER.email);
  });

  test('login with registered credentials returns a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: USER.email, password: USER.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  test('GET /api/auth/me returns the logged-in user', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(USER.email);
  });

  test('duplicate registration is rejected', async () => {
    const res = await request(app).post('/api/auth/register').send(USER);
    expect(res.status).toBe(409);
  });

  test('GET /api/auth/me without token returns 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('GET /api/auth/me with invalid token returns 401', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
  });
});
