# AI Chat Application with Context Memory (RAG)

This project is a full-stack AI chat application that utilizes context memory for enhanced conversation capabilities. It is built using a microservices architecture, with a frontend developed in Next.js, a backend in Spring Boot, and an AI service using FastAPI.

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, React Query
- **Backend**: Java Spring Boot, PostgreSQL, JPA/Hibernate, JWT Authentication
- **AI Service**: Python FastAPI, OpenAI API (or compatible LLM), Vector database (FAISS or ChromaDB)

## Core Features

1. **Chat System**: 
   - Create and manage conversations
   - Send messages and receive AI responses
   - Stream responses token-by-token

2. **Context Memory (RAG)**:
   - Store embeddings for each message
   - Retrieve relevant past messages per query
   - Inject retrieved context into LLM prompt

3. **Conversation History**:
   - Sidebar with conversation list
   - Ability to load previous chats
   - Search conversations

4. **Authentication**:
   - Register/Login with JWT
   - Protect chat routes

## Project Structure

```
ai-chat-rag-starter
├── frontend
├── backend
└── ai-service
```

## Getting Started

### Prerequisites

- Node.js (for frontend)
- Java (for backend)
- Python (for AI service)
- PostgreSQL (for backend database)
- Docker (for containerization)

### Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd ai-chat-rag-starter
   ```

2. **Frontend Setup**:
   - Navigate to the `frontend` directory:
     ```
     cd frontend
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Run the development server:
     ```
     npm run dev
     ```

3. **Backend Setup**:
   - Navigate to the `backend` directory:
     ```
     cd backend
     ```
   - Build and run the Spring Boot application:
     ```
     ./mvnw spring-boot:run
     ```

4. **AI Service Setup**:
   - Navigate to the `ai-service` directory:
     ```
     cd ai-service
     ```
   - Install dependencies:
     ```
     pip install -r requirements.txt
     ```
   - Run the FastAPI application:
     ```
     uvicorn app.main:app --reload
     ```

5. **Docker Setup** (optional):
   - Run all services using Docker Compose:
     ```
     docker-compose up
     ```

## Environment Variables

Make sure to set the following environment variables for each service:

- **Frontend**: API endpoint for the backend
- **Backend**: Database connection details, JWT secret
- **AI Service**: OpenAI API key, vector database configuration

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.
