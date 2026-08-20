# AI Chat Application Backend (Node.js / TypeScript / TypeORM)

This is the backend service for the AI Chat Application, built with **Node.js**, **Express**, **TypeScript**, **TypeORM**, and **WebSockets**. It provides RESTful APIs and real-time WebSocket communication for user authentication, conversation management, message handling, and document processing via the Python AI Service.

## Features

- **TypeORM ORM Layer**: Robust data layer with TypeScript entities, relations, migrations/auto-synchronization.
- **User Authentication**: Register and login with JWT tokens and bcrypt password hashing.
- **Conversation Management**: Create and list conversations.
- **Message Management & Real-Time Chat**: REST endpoints and WebSockets (`/ws-chat`) for real-time messaging with instant AI responses.
- **AI Service Integration**: Connects to the FastAPI RAG service for LLM responses and document embeddings.
- **Multi-Database Support**: Native PostgreSQL with TypeORM and automated local SQLite fallback.
- **Data Seeder**: Automatically creates database tables and seeds initial users (`testuser`, `ai_assistant`) and default conversation.

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── env.ts                  # Configuration and environment variables
│   │   └── database.ts             # TypeORM DataSource & Repositories
│   ├── entities/
│   │   ├── User.ts                 # TypeORM User entity
│   │   ├── Conversation.ts         # TypeORM Conversation entity
│   │   ├── Message.ts              # TypeORM Message entity
│   │   └── index.ts
│   ├── db/
│   │   └── dataSeeder.ts           # Initial database seeding via TypeORM
│   ├── middleware/
│   │   ├── auth.ts                 # JWT authentication middleware
│   │   └── errorHandler.ts         # Global error handler
│   ├── models/
│   │   ├── User.ts                 # User interfaces and DTOs
│   │   ├── Conversation.ts         # Conversation interfaces and DTOs
│   │   └── Message.ts              # Message interfaces and DTOs
│   ├── services/
│   │   ├── authService.ts          # Auth business logic
│   │   ├── conversationService.ts  # Conversation business logic
│   │   ├── messageService.ts       # Message business logic
│   │   └── aiClient.ts             # Client for Python FastAPI service
│   ├── controllers/
│   │   ├── authController.ts       # Authentication HTTP handlers
│   │   ├── conversationController.ts # Conversation HTTP handlers
│   │   ├── messageController.ts    # Message HTTP handlers
│   │   └── fileController.ts       # File upload HTTP handlers
│   ├── routes/
│   │   ├── authRoutes.ts           # /auth routes
│   │   ├── conversationRoutes.ts   # /conversations routes
│   │   ├── messageRoutes.ts        # /messages routes
│   │   ├── fileRoutes.ts           # /files routes
│   │   └── index.ts
│   ├── websocket/
│   │   └── chatWebSocketHandler.ts # Real-time WebSocket chat handler
│   ├── app.ts                      # Express app setup and middleware
│   └── server.ts                   # Main server bootstrap
├── tests/
│   ├── auth.test.ts                # Auth API tests
│   ├── conversation.test.ts        # Conversation API tests
│   └── message.test.ts             # Message API tests
├── Dockerfile                      # Production multi-stage Docker build
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Development Mode
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Run Production Build
```bash
npm start
```

### 5. Run Tests
```bash
npm test
```

## API Endpoints

### Authentication (`/auth`)
- `POST /auth/register` - Register a new user (`{ username, email, password }`)
- `POST /auth/login` - Login user (`{ email, password }`)

### Conversations (`/conversations`)
- `GET /conversations` - Retrieve all conversations with messages
- `POST /conversations` - Create a new conversation (`{ title }`)

### Messages (`/messages`)
- `GET /messages/:conversationId` - Retrieve messages for a conversation
- `POST /messages` - Send a message and get AI response (`{ conversationId, userId, content }`)

### File Uploads (`/files`)
- `POST /files/upload` - Upload file to AI Service (multipart/form-data with `userId` and `file`)

### Real-Time WebSocket
- `ws://localhost:8080/ws-chat?conversationId=:id` - Real-time bi-directional chat socket