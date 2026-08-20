import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend directory or project root
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

function parseJdbcUrl(url?: string): { host?: string; port?: number; database?: string } {
  if (!url) return {};
  // Handle jdbc:postgresql://host:port/database
  const match = url.match(/^jdbc:postgresql:\/\/([^:/]+)(?::(\d+))?\/([^?]+)/);
  if (match) {
    return {
      host: match[1],
      port: match[2] ? parseInt(match[2], 10) : 5432,
      database: match[3],
    };
  }
  return {};
}

const jdbcConfig = parseJdbcUrl(process.env.SPRING_DATASOURCE_URL);

export const config = {
  port: parseInt(process.env.PORT || process.env.SERVER_PORT || '8080', 10),
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret',
    expiration: parseInt(process.env.JWT_EXPIRATION || '86400', 10),
  },
  aiService: {
    url: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  db: {
    url: process.env.DATABASE_URL,
    host: process.env.POSTGRES_HOST || jdbcConfig.host || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || (jdbcConfig.port ? String(jdbcConfig.port) : '5432'), 10),
    database: process.env.POSTGRES_DB || jdbcConfig.database || process.env.DB_NAME || 'chatdb',
    user: process.env.SPRING_DATASOURCE_USERNAME || process.env.POSTGRES_USER || process.env.DB_USER || 'postgres',
    password: process.env.SPRING_DATASOURCE_PASSWORD || process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD || 'postgres',
    useSqliteFallback: process.env.NODE_ENV === 'test' || process.env.USE_SQLITE === 'true',
  },
};
