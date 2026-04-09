# AI Chat Application with Context Memory (RAG)

This project is a full-stack AI chat application that utilizes context memory for enhanced conversation capabilities. It is built using a microservices architecture, with a frontend developed in Next.js, a backend in Spring Boot, and an AI service using FastAPI.

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, React Query
- **Backend**: Java Spring Boot, PostgreSQL, JPA/Hibernate, JWT Authentication
- **AI Service**: Python FastAPI, OpenAI API (or local Ollama), Qdrant Vector Database, Sentence-Transformers

## Core Features

1. **Chat System**: 
   - Create and manage conversations
   - Send messages and receive AI responses
   - Intelligent RAG-based context injection

2. **Context Memory (Qdrant RAG)**:
   - Real-time vector embeddings using `all-MiniLM-L6-v2`
   - High-performance similarity search with Qdrant
   - Persistent storage for long-term conversation context

3. **AI Operation Visibility**:
   - Detailed logging of the RAG pipeline
   - Real-time monitoring of vector searches and LLM calls

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

5. **Docker Setup** (Recommended):
   - Run all services, including **Qdrant**, using Docker Compose:
     ```bash
     docker-compose up --build
     ```
   - This is the easiest way to see all components working together.

## Viewing AI Operations

The AI service is configured with verbose logging to help you see exactly what's happening "under the hood" during a chat.

### How to view the logs:
1. If running via Docker:
   ```bash
   docker logs -f ai-chat-application-main-ai-service-1
   ```
2. If running locally, the output will appear directly in your terminal where `uvicorn` is running.

### What you will see:
When a message is sent, the logs will show:
- **Embedding Generation**: Confirmation that the message is being converted to a 384-dimension vector.
- **Qdrant Storage**: Details of the message being upserted into the `messages` collection.
- **Qdrant Search**: Logs of the similarity search used to find relevant context from previous turns.
- **LLM Call**: The final prompt being sent to OpenAI or Ollama, including the injected context.

## Environment Variables

Make sure to set the following environment variables for each service:

- **Frontend**: API endpoint for the backend
- **Backend**: Database connection details, JWT secret
- **AI Service**: OpenAI API key, vector database configuration

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.
