# High-Level Architectural Summary

This project implements a **full-stack AI chat application** with a modular, layered architecture comprising distinct containers for frontend, backend, and AI services. The system integrates a web client (Next.js), a backend API (Spring Boot), and an AI processing layer (FastAPI with LLM and RAG components). The architecture emphasizes separation of concerns, extensibility, and efficient retrieval of contextual information via vector similarity search.

---

# 1. Major Containers and Their Responsibilities

### 1.1 Frontend (Next.js)
- **Purpose:** User interface for chat interactions.
- **Key Components:**
  - Layout, Sidebar, ChatWindow, MessageBubble, InputBox, Providers.
- **Interactions:**
  - Calls REST API endpoints to fetch conversations/messages.
  - Sends user messages to backend via API.
  - Uses React Query for state management and data fetching.
- **External Dependencies:** Tailwind CSS, React, Next.js.

### 1.2 Backend (Spring Boot)
- **Purpose:** Core API server handling authentication, conversation, and message management.
- **Key Components:**
  - REST controllers for conversations, messages, auth.
  - Data persistence via JPA (PostgreSQL or H2 for testing).
  - Security via JWT tokens.
- **Interactions:**
  - Provides endpoints for frontend to manage conversations/messages.
  - Acts as a gateway to the AI service for chat processing.
- **External Dependencies:** PostgreSQL, H2, Spring Security, JWT.

### 1.3 AI Service (FastAPI)
- **Purpose:** Handles AI chat logic, including prompt generation, embedding, retrieval, and LLM API calls.
- **Key Components:**
  - `main.py`: FastAPI app with CORS middleware.
  - `api/chat.py`: API endpoint `/chat` for chat requests.
  - `core/embeddings.py`: Embedding generation.
  - `core/rag.py`: Retrieval-Augmented Generation (RAG) logic.
  - `core/llm.py`: Calls to external LLM APIs (OpenAI or local).
  - `db/vector_store.py`: Vector store for similarity search (FAISS or fallback).
- **Interactions:**
  - Receives chat requests from backend or frontend.
  - Generates embeddings for messages.
  - Retrieves relevant context via vector similarity.
  - Calls LLM API with context and user message.
  - Stores message embeddings for future retrieval.
- **External Dependencies:** FastAPI, FAISS (optional), OpenAI SDK, numpy, scikit-learn.

---

# 2. Core Components and Their Roles

### 2.1 Frontend Components
- **ChatWindow:** Displays conversation messages, handles auto-scrolling, shows typing indicator.
- **MessageBubble:** Renders individual messages, differentiates user vs AI.
- **InputBox:** User input form, triggers message send.
- **Sidebar:** Lists conversations, allows switching or creating new ones.
- **Providers:** Context providers for React Query.

### 2.2 Backend API
- **API Endpoints:**
  - `/messages/{conversationId}`: Fetch messages.
  - `/messages`: Post new message.
  - `/conversations`: List/create conversations.
  - `/auth`: Register/login/logout.
- **Responsibilities:** Authentication, conversation/message CRUD, session management.

### 2.3 AI Service Components
- **`app/main.py`:** FastAPI app setup, CORS, route inclusion.
- **`api/chat.py`:** Main chat endpoint:
  - Receives user message.
  - Calls core logic to generate embedding.
  - Retrieves relevant context via RAG.
  - Constructs prompt.
  - Calls LLM API.
  - Returns response.
- **`core/embeddings.py`:** Embedding generation:
  - Uses a model (e.g., sentence transformer).
  - Stores embeddings in memory or vector store.
- **`core/rag.py`:** Retrieval-augmented generation:
  - Stores message embeddings.
  - Retrieves similar past messages based on embedding similarity.
  - Builds context string for prompt.
- **`core/llm.py`:** Calls external LLM APIs:
  - Supports OpenAI or local models.
  - Handles request/response, errors.
- **`db/vector_store.py`:** Vector similarity search:
  - Uses FAISS if available.
  - Fallback to simple list search.
  - Stores embeddings and metadata.

---

# 3. External Dependencies and Data Flow

### 3.1 External APIs
- **OpenAI API:** For generating chat completions.
- **Local LLM (Ollama):** Optional fallback.
- **PostgreSQL/H2:** Data persistence for conversations/messages.
- **FAISS:** Efficient vector similarity search (optional).

### 3.2 Data Flow
- **User Interaction:**
  - User sends message via frontend.
  - Frontend calls backend API `/messages`.
  - Backend stores message, triggers AI processing.
- **AI Processing:**
  - Backend forwards message to FastAPI `/chat`.
  - `chat.py`:
    - Calls `generate_embedding`.
    - Stores embedding via `rag.store_message_embedding`.
    - Retrieves relevant context via `rag.retrieve_relevant_context`.
    - Builds prompt.
    - Calls `call_llm_api`.
    - Sends response back to backend.
- **Response Delivery:**
  - Backend returns AI response.
  - Frontend displays message.
  - Embeddings are stored for future retrieval.

---

# 4. Additional Architectural Details

### 4.1 Modular Design
- Clear separation between:
  - API layer (`api/`)
  - Core logic (`core/`)
  - Data storage (`db/`)
- Supports easy extension (e.g., adding new embedding models or vector stores).

### 4.2 Extensibility
- Embedding and LLM modules are pluggable.
- Vector store can switch between FAISS and simple list.
- Frontend is decoupled from backend logic via REST API.

### 4.3 Runtime Dynamics
- **Frontend**: React app running in browser.
- **Backend**: Spring Boot server managing user sessions and data.
- **AI Service**: FastAPI app running independently, invoked by backend or directly by frontend.
- **Vector Store**: In-memory or FAISS index for similarity search, persists embeddings.

---

# 5. Missing or Uncertain Details
- Exact communication protocol between backend and AI service (assumed REST API).
- Authentication flow details (JWT tokens stored in localStorage).
- Specific models used for embeddings (assumed sentence transformers).
- Deployment details (Docker Compose orchestrates containers).

---

# **Summary**

This architecture is a **multi-container, layered system** with:
- A **Next.js frontend** for user interaction.
- A **Spring Boot backend** providing REST APIs for conversation management.
- An **AI service** built with FastAPI, handling embedding, retrieval (RAG), and LLM calls.
- A **vector store** (FAISS or fallback) for efficient similarity search.
- External dependencies include OpenAI SDK, FAISS, and a database (PostgreSQL/H2).

The system emphasizes **modularity, scalability, and extensibility**, with clear separation of concerns across presentation, API, core logic, and data storage layers.

---

This detailed architecture description provides a comprehensive basis for generating a system diagram in Mermaid or similar notation, capturing containers, components, dependencies, and data/control flows.