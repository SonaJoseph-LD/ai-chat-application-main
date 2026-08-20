import request from 'supertest';
import { createApp } from '../src/app';
import { db } from '../src/config/database';
import { seedDatabase } from '../src/db/dataSeeder';
import { messageService } from '../src/services/messageService';

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

describe('Message API', () => {
  it('should fetch messages for a conversation', async () => {
    // Save a direct message
    await messageService.saveMessage(1, 1, 'Hello from test');

    const res = await request(app).get('/messages/1');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty('content', 'Hello from test');
    expect(res.body[0].user).toHaveProperty('username', 'testuser');
  });

  it('should reject get messages with invalid conversation id', async () => {
    const res = await request(app).get('/messages/invalid-id');
    expect(res.status).toBe(400);
  });
});
