import request from 'supertest';
import { createApp } from '../src/app';
import { db } from '../src/config/database';
import { seedDatabase } from '../src/db/dataSeeder';

const app = createApp();

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.USE_SQLITE = 'true';
  await db.init();
  await seedDatabase();
});

afterAll(async () => {
  await db.close();
});

describe('Authentication API', () => {
  it('should login seeded testuser successfully', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
    expect(res.body.user).toHaveProperty('username', 'testuser');
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
  });

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'alice',
        email: 'alice@example.com',
        password: 'alicepassword',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toBe('alice');
    expect(res.body.email).toBe('alice@example.com');
  });

  it('should reject duplicate email on registration', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'alice2',
        email: 'alice@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already registered/i);
  });
});
