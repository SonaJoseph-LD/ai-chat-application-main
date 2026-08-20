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

describe('Conversation API', () => {
  it('should get all conversations including seeded conversation', async () => {
    const res = await request(app).get('/conversations');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('title');
  });

  it('should create a new conversation', async () => {
    const res = await request(app)
      .post('/conversations')
      .send({
        title: 'Project Discussion',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Project Discussion');
    expect(res.body.messages).toBeNull();
  });
});
