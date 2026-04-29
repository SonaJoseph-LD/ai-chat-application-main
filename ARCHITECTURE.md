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

### 1.3 AI Service (FastAPI + LangChain)
- **Purpose:** Handles AI chat logic using LangChain for orchestration, embedding, retrieval, and LLM communication.
- **Key Components:**
  - `main.py`: FastAPI app with CORS middleware.
  - `api/chat.py`: API endpoint `/chat` utilizing LangChain LCEL chains.
  - `api/documents.py`: Document ingestion using LangChain Loaders and Splitters.
  - `core/embeddings.py`: `HuggingFaceEmbeddings` integration.
  - `core/rag.py`: RAG orchestration via LangChain Expression Language (LCEL).
  - `core/llm.py`: Unified interface for `ChatOpenAI` and `ChatOllama`.
  - `db/vector_store.py`: `QdrantVectorStore` for similarity search.
- **Interactions:**
  - Receives chat requests from backend or frontend.
  - Generates embeddings via LangChain.
  - Retrieves relevant context via LangChain Retrievers.
  - Orchestrates the full prompt-to-response pipeline via LCEL.
  - Stores message embeddings in Qdrant.
- **External Dependencies:** FastAPI, LangChain, Qdrant Client, OpenAI SDK, HuggingFace.

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
  - Invokes the LangChain LCEL chain.
  - Returns AI response.
- **`api/documents.py`:** Document ingestion endpoint:
  - Uses `PyPDFLoader`, `CSVLoader`, or `TextLoader` to parse files.
  - Uses `RecursiveCharacterTextSplitter` for semantic chunking.
  - Adds documents to `QdrantVectorStore`.
- **`core/embeddings.py`:** LangChain Embedding wrapper:
  - Uses `HuggingFaceEmbeddings` (`all-MiniLM-L6-v2`).
- **`core/rag.py`:** RAG orchestration via LCEL:
  - Defines `ChatPromptTemplate`.
  - Configures `VectorStoreRetriever`.
  - Builds the `(Retriever | Prompt | LLM | Parser)` chain.
- **`core/llm.py`:** LangChain Chat Models:
  - Provides `ChatOpenAI` or `ChatOllama` based on configuration.
- **`db/vector_store.py`:** LangChain Qdrant Integration:
  - Connects to Qdrant.
  - Provides a standardized `QdrantVectorStore` instance.

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
    - Stores incoming message via `_rag.store_message_embedding` (for future context).
    - Retrieves the LCEL chain via `get_rag_chain(user_id)`.
    - Invokes the chain (`chain.ainvoke`).
    - The chain automatically retrieves context from Qdrant, formats the prompt, calls the LLM, and parses the result.
    - Sends response back to backend.
- **Response Delivery:**
  - Backend returns AI response.
  - Frontend displays message.

---

# 4. Additional Architectural Details

### 4.1 Modular Design
- Clear separation between:
  - API layer (`api/`)
  - Core logic (`core/`)
  - Data storage (`db/`)
- Supports easy extension via LangChain components.

### 4.2 Extensibility
- Embedding and LLM modules are standardized using LangChain interfaces.
- Vector store can be easily swapped for any other LangChain-supported vector database.
- Frontend is decoupled from backend logic via REST API.

### 4.3 Runtime Dynamics
- **Frontend**: React app running in browser.
- **Backend**: Spring Boot server managing user sessions and data.
- **AI Service**: FastAPI app running independently, utilizing LangChain for intelligent retrieval.
- **Vector Store**: Qdrant instance for similarity search.

---

# 5. Missing or Uncertain Details
- Exact communication protocol between backend and AI service (assumed REST API).
- Authentication flow details (JWT tokens stored in localStorage).
- Deployment details (Docker Compose orchestrates containers).

---

# **Summary**

This architecture is a **multi-container, layered system** with:
- A **Next.js frontend** for user interaction.
- A **Spring Boot backend** providing REST APIs for conversation management.
- An **AI service** built with FastAPI and **LangChain**, handling embedding, retrieval (RAG), and LLM calls via LCEL chains.
- A **Qdrant vector database** for efficient similarity search and long-term context memory.

The system emphasizes **modularity, scalability, and extensibility**, leveraging the LangChain ecosystem to provide a robust and flexible AI processing layer.

---

This detailed architecture description provides a comprehensive basis for generating a system diagram in Mermaid or similar notation, capturing containers, components, dependencies, and data/control flows.