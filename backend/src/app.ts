import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import conversationRoutes from './routes/conversationRoutes';
import messageRoutes from './routes/messageRoutes';
import fileRoutes from './routes/fileRoutes';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config/env';

export function createApp(): Application {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl) or any origin in dev
        callback(null, true);
      },
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root health check
  app.get('/', (req, res) => {
    res.json({
      status: 'UP',
      service: 'AI Chat Backend (Node.js)',
      timestamp: new Date().toISOString(),
    });
  });

  // Routes
  app.use('/auth', authRoutes);
  app.use('/conversations', conversationRoutes);
  app.use('/messages', messageRoutes);
  app.use('/files', fileRoutes);

  // Error handling middleware
  app.use(errorHandler);

  return app;
}
