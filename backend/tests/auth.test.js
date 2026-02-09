process.env.DATABASE_URL = 'sqlite::memory:';
process.env.JWT_SECRET = 'testsecret';
const request = require('supertest');
const { app, start } = require('../src/index');
const sequelize = require('../src/sequelize');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

test('register and login', async () => {
  const res = await request(app).post('/auth/register').send({
    email: 'a@b.com',
    password: 'password',
    name: 'Alice',
    role: 'student'
  });
  expect(res.statusCode).toBe(201);
  expect(res.body.token).toBeDefined();

  const login = await request(app).post('/auth/login').send({
    email: 'a@b.com',
    password: 'password'
  });
  expect(login.statusCode).toBe(200);
  expect(login.body.token).toBeDefined();
});
