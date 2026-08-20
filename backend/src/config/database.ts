import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';
import fs from 'fs';
import { config } from './env';
import { User, Conversation, Message } from '../entities';

export let AppDataSource: DataSource;

let isInitialized = false;
let isPostgres = false;
let initPromise: Promise<DataSource> | null = null;

export async function initializeDatabase(): Promise<DataSource> {
  if (isInitialized && AppDataSource && AppDataSource.isInitialized) {
    return AppDataSource;
  }
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    if (!config.db.useSqliteFallback) {
      try {
        const pgOptions: DataSourceOptions = config.db.url
          ? {
              type: 'postgres',
              url: config.db.url,
              entities: [User, Conversation, Message],
              synchronize: true,
              logging: false,
              extra: {
                connectionTimeoutMillis: 3000,
              },
            }
          : {
              type: 'postgres',
              host: config.db.host,
              port: config.db.port,
              username: config.db.user,
              password: config.db.password,
              database: config.db.database,
              entities: [User, Conversation, Message],
              synchronize: true,
              logging: false,
              extra: {
                connectionTimeoutMillis: 3000,
              },
            };

        const pgSource = new DataSource(pgOptions);
        await pgSource.initialize();
        AppDataSource = pgSource;
        isPostgres = true;
        isInitialized = true;
        console.log(
          `[TypeORM] Connected to PostgreSQL at ${config.db.host}:${config.db.port}/${config.db.database}`
        );
        return AppDataSource;
      } catch (err: any) {
        console.warn(
          `[TypeORM] PostgreSQL connection failed (${err.message}). Falling back to SQLite for local development.`
        );
      }
    }

    // Fallback to SQLite using better-sqlite3
    const dbPath =
      process.env.NODE_ENV === 'test'
        ? ':memory:'
        : path.resolve(__dirname, '../../chatdb.sqlite');

    const dbDir = path.dirname(dbPath);
    if (dbPath !== ':memory:' && !fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const sqliteOptions: DataSourceOptions = {
      type: 'better-sqlite3',
      database: dbPath,
      entities: [User, Conversation, Message],
      synchronize: true,
      logging: false,
    };

    const sqliteSource = new DataSource(sqliteOptions);
    await sqliteSource.initialize();
    AppDataSource = sqliteSource;
    isPostgres = false;
    isInitialized = true;
    console.log(`[TypeORM] SQLite database initialized at ${dbPath}`);
    return AppDataSource;
  })();

  return initPromise;
}

export async function closeDatabase(): Promise<void> {
  if (AppDataSource && AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    isInitialized = false;
    initPromise = null;
  }
}

export function getUserRepository() {
  return AppDataSource.getRepository(User);
}

export function getConversationRepository() {
  return AppDataSource.getRepository(Conversation);
}

export function getMessageRepository() {
  return AppDataSource.getRepository(Message);
}

export const db = {
  init: initializeDatabase,
  close: closeDatabase,
  get isPostgres() {
    return isPostgres;
  },
};
