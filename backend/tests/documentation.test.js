const request = require('supertest');
const app = require('../app');
const { sequelize, User } = require('../models');

const TEST_USER = {
  name: 'Jest Test User',
  email: 'jest_test@jager.ee',
  password: 'testpass123',
  age: 25,
  hasGunLicense: false,
};

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  await request(app).post('/api/auth/register').send(TEST_USER);
});

afterAll(async () => {
  await User.destroy({ where: { email: TEST_USER.email } });
  await sequelize.close();
});

// Test 1: Sisselogimine (Login)
describe('Sisselogimine', () => {
  test('edukas sisselogimine tagastab tokeni', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_USER.email, password: TEST_USER.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});

// Test 2: Vale parool (Wrong password)
describe('Vale parool', () => {
  test('vale parooliga sisselogimine tagastab vea', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_USER.email, password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });
});

// Test 3: Tellimuse loomine (Order creation)
describe('Tellimuse loomine', () => {
  let token;
  let productId;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_USER.email, password: TEST_USER.password });
    token = loginRes.body.token;

    const productsRes = await request(app).get('/api/products');
    const nonRestricted = productsRes.body.products.find((p) => !p.isRestricted && p.stock > 0);
    productId = nonRestricted.id;
  });

  test('tellimus salvestatakse andmebaasi', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId, quantity: 1 }] });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('order');
    expect(res.body.order).toHaveProperty('id');
    expect(res.body.order.status).toBe('pending');
  });
});
