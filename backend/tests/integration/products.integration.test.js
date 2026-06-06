const request = require('supertest');
const app = require('../../app');
const { sequelize, User, Product } = require('../../models');

const ADMIN = { email: 'admin@jager.ee', password: 'admin123' };
const REGULAR = { email: 'user@jager.ee', password: 'user123' };

let adminToken;
let regularToken;
let createdProductId;

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync();

  const [adminRes, userRes] = await Promise.all([
    request(app).post('/api/auth/login').send(ADMIN),
    request(app).post('/api/auth/login').send(REGULAR),
  ]);
  adminToken = adminRes.body.token;
  regularToken = userRes.body.token;
});

afterAll(async () => {
  if (createdProductId) {
    await Product.destroy({ where: { id: createdProductId } });
  }
  await sequelize.close();
});

describe('Products flow: public browsing', () => {
  test('GET /api/products returns product list without auth', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('products');
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  test('GET /api/products/:id returns a single product', async () => {
    const listRes = await request(app).get('/api/products');
    const id = listRes.body.products[0].id;
    const res = await request(app).get(`/api/products/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.product.id).toBe(id);
  });

  test('GET /api/products/:id returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/products/999999');
    expect(res.status).toBe(404);
  });
});

describe('Products flow: admin CRUD', () => {
  test('admin can create a product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Integration Test Product', price: 9.99, stock: 5, isRestricted: false });
    expect(res.status).toBe(201);
    expect(res.body.product.name).toBe('Integration Test Product');
    createdProductId = res.body.product.id;
  });

  test('admin can update the product', async () => {
    const res = await request(app)
      .put(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 19.99 });
    expect(res.status).toBe(200);
    expect(parseFloat(res.body.product.price)).toBe(19.99);
  });

  test('admin can delete the product', async () => {
    const res = await request(app)
      .delete(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    createdProductId = null;
  });

  test('deleted product returns 404', async () => {
    const res = await request(app).get('/api/products/999999');
    expect(res.status).toBe(404);
  });

  test('regular user cannot create a product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${regularToken}`)
      .send({ name: 'Should fail', price: 1.00, stock: 1, isRestricted: false });
    expect(res.status).toBe(403);
  });

  test('unauthenticated user cannot create a product', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Should fail', price: 1.00, stock: 1, isRestricted: false });
    expect(res.status).toBe(401);
  });
});
