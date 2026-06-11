const request = require('supertest');
const app = require('../../app');
const { sequelize, User, Order } = require('../../models');

const ADMIN = { email: 'admin@jager.ee', password: 'admin123' };

const UNLICENSED_USER = {
  name: 'Unlicensed User',
  email: 'unlicensed_integration@jager.ee',
  password: 'testpass123',
  age: 25,
  hasGunLicense: false,
};

const LICENSED_USER = {
  name: 'Licensed User',
  email: 'licensed_integration@jager.ee',
  password: 'testpass123',
  age: 25,
  hasGunLicense: true,
};

const UNDERAGE_USER = {
  name: 'Underage User',
  email: 'underage_integration@jager.ee',
  password: 'testpass123',
  age: 16,
  hasGunLicense: true,
};

let adminToken;
let unlicensedToken;
let licensedToken;
let underageToken;
let nonRestrictedProductId;
let restrictedProductId;
let createdOrderId;

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync();

  await Promise.all([
    request(app).post('/api/auth/register').send(UNLICENSED_USER),
    request(app).post('/api/auth/register').send(LICENSED_USER),
    request(app).post('/api/auth/register').send(UNDERAGE_USER),
  ]);

  const [adminRes, unlicensedRes, licensedRes, underageRes] = await Promise.all([
    request(app).post('/api/auth/login').send(ADMIN),
    request(app).post('/api/auth/login').send({ email: UNLICENSED_USER.email, password: UNLICENSED_USER.password }),
    request(app).post('/api/auth/login').send({ email: LICENSED_USER.email, password: LICENSED_USER.password }),
    request(app).post('/api/auth/login').send({ email: UNDERAGE_USER.email, password: UNDERAGE_USER.password }),
  ]);
  adminToken = adminRes.body.token;
  unlicensedToken = unlicensedRes.body.token;
  licensedToken = licensedRes.body.token;
  underageToken = underageRes.body.token;

  const productsRes = await request(app).get('/api/products');
  const products = productsRes.body.products;
  nonRestrictedProductId = products.find((p) => !p.isRestricted && p.stock > 0)?.id;
  restrictedProductId = products.find((p) => p.isRestricted && p.stock > 0)?.id;
});

afterAll(async () => {
  await User.destroy({
    where: { email: [UNLICENSED_USER.email, LICENSED_USER.email, UNDERAGE_USER.email] },
  });
  await sequelize.close();
});

describe('Orders flow: placing orders', () => {
  test('authenticated user can place an order for a non-restricted item', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${unlicensedToken}`)
      .send({ items: [{ productId: nonRestrictedProductId, quantity: 1 }] });
    expect(res.status).toBe(201);
    expect(res.body.order.status).toBe('pending');
    createdOrderId = res.body.order.id;
  });

  test('placed order appears in user order list', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${unlicensedToken}`);
    expect(res.status).toBe(200);
    const ids = res.body.orders.map((o) => o.id);
    expect(ids).toContain(createdOrderId);
  });

  test('unauthenticated user cannot place an order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ items: [{ productId: nonRestrictedProductId, quantity: 1 }] });
    expect(res.status).toBe(401);
  });

  test('user without gun license cannot order restricted item', async () => {
    if (!restrictedProductId) return;
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${unlicensedToken}`)
      .send({ items: [{ productId: restrictedProductId, quantity: 1 }] });
    expect(res.status).toBe(403);
  });

  test('underage user cannot order restricted item even with gun license', async () => {
    if (!restrictedProductId) return;
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${underageToken}`)
      .send({ items: [{ productId: restrictedProductId, quantity: 1 }] });
    expect(res.status).toBe(403);
  });

  test('licensed adult user can order a restricted item', async () => {
    if (!restrictedProductId) return;
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${licensedToken}`)
      .send({ items: [{ productId: restrictedProductId, quantity: 1 }] });
    expect(res.status).toBe(201);
  });

  test('order with non-existent product returns 404', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${unlicensedToken}`)
      .send({ items: [{ productId: 999999, quantity: 1 }] });
    expect(res.status).toBe(404);
  });

  test('order with empty items array returns 400', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${unlicensedToken}`)
      .send({ items: [] });
    expect(res.status).toBe(400);
  });
});

describe('Orders flow: admin management', () => {
  test('admin can view all orders', async () => {
    const res = await request(app)
      .get('/api/orders/admin')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.orders)).toBe(true);
  });

  test('admin can update order status', async () => {
    const res = await request(app)
      .patch(`/api/orders/${createdOrderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'confirmed' });
    expect(res.status).toBe(200);
    expect(res.body.order.status).toBe('confirmed');
  });

  test('invalid status value is rejected', async () => {
    const res = await request(app)
      .patch(`/api/orders/${createdOrderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'flying' });
    expect(res.status).toBe(400);
  });

  test('regular user cannot view all orders', async () => {
    const res = await request(app)
      .get('/api/orders/admin')
      .set('Authorization', `Bearer ${unlicensedToken}`);
    expect(res.status).toBe(403);
  });
});
