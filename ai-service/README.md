# AI Chat RAG Starter - AI Service

This directory contains the FastAPI service for the AI chat application, which handles chat requests and integrates with the OpenAI API for generating responses.

## Project Structure

- `app/main.py`: Entry point for the FastAPI application.
- `app/api/chat.py`: Endpoint for handling chat requests.
- `app/core/config.py`: Configuration settings for the AI service.
- `app/core/embeddings.py`: Logic for generating embeddings for messages.
- `app/core/llm.py`: Logic for interacting with the LLM API.
- `app/core/rag.py`: Logic for retrieving relevant past messages.
- `app/db/vector_store.py`: Logic for interacting with the vector database.
- `app/db/vector_store.py`: Logic for interacting with Qdrant vector database.

## Tech Details

### Vector Database: Qdrant
- **Collection Name**: `messages`
- **Distance Metric**: `Cosine Similarity`
- **Embedding Model**: `all-MiniLM-L6-v2` (384 dimensions)
- **Features**: Automatic collection creation, local persistence (if running in Docker or connected to a remote host), and in-memory fallback.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd ai-chat-application-main/ai-service
   ```

2. **Create a Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Dependencies**
   The project uses `poetry` or `pip`. If using `pip`:
   ```bash
   pip install fastapi uvicorn pydantic qdrant-client sentence-transformers requests
   ```

4. **Run the Application**
   ```bash
   uvicorn app.main:app --reload
   ```

5. **Access the API**
   The API will be available at `http://localhost:8000`.

## Environment Variables

The AI service uses the following variables:

- `OPENAI_API_KEY`: OpenAI API key. If not provided, the service will attempt to use a local Ollama instance (`http://localhost:11434`).
- `QDRANT_HOST`: Host for Qdrant (default: `localhost`).
- `QDRANT_PORT`: Port for Qdrant (default: `6333`).

## Monitoring AI Operations

The service provides verbose console output for every chat request. You can see the RAG flow step-by-step:
1. Embedding generation from text.
2. Similarity search in Qdrant.
3. Relevant context retrieval.
4. LLM prompt composition.
5. Final LLM response.


## Usage

- The main endpoint for chat interactions is located at `/chat`.
- The service generates embeddings for incoming messages, retrieves relevant past messages, and interacts with the LLM API to generate responses.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes. 

## License

This project is licensed under the MIT License. See the LICENSE file for details.