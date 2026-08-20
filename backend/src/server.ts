import 'reflect-metadata';
import http from 'http';
import { WebSocketServer } from 'ws';
import { createApp } from './app';
import { config } from './config/env';
import { db } from './config/database';
import { seedDatabase } from './db/dataSeeder';
import { chatWebSocketHandler } from './websocket/chatWebSocketHandler';

async function bootstrap() {
  try {
    // 1. Initialize Database
    console.log('[Server] Initializing database...');
    await db.init();

    // 2. Run Data Seeder
    await seedDatabase();

    // 3. Create Express App & HTTP Server
    const app = createApp();
    const server = http.createServer(app);

    // 4. Attach WebSocket Server
    const wss = new WebSocketServer({ server, path: '/ws-chat' });
    chatWebSocketHandler.setup(wss);

    // 5. Start Server
    const port = config.port;
    server.listen(port, () => {
      console.log(`=========================================`);
      console.log(`AI Chat Backend (Node.js/TypeScript)`);
      console.log(`HTTP Server running on http://localhost:${port}`);
      console.log(`WebSocket Server on ws://localhost:${port}/ws-chat`);
      console.log(`AI Service URL: ${config.aiService.url}`);
      console.log(`Database: ${db.isPostgres ? 'PostgreSQL' : 'SQLite'}`);
      console.log(`=========================================`);
    });

    const shutdown = async () => {
      console.log('\n[Server] Shutting down gracefully...');
      wss.close();
      server.close();
      await db.close();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('[Server] Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
