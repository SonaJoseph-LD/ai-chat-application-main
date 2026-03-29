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
- `app/models/schemas.py`: Data models and schemas for the AI service.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd ai-chat-rag-starter/ai-service
   ```

2. **Create a Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Application**
   ```bash
   uvicorn app.main:app --reload
   ```

5. **Access the API**
   The API will be available at `http://localhost:8000`.

## Environment Variables

Make sure to set the following environment variables for the AI service:

- `OPENAI_API_KEY`: Your API key for accessing the OpenAI API.
- `VECTOR_DB_URL`: Connection string for the vector database.

## Usage

- The main endpoint for chat interactions is located at `/chat`.
- The service generates embeddings for incoming messages, retrieves relevant past messages, and interacts with the LLM API to generate responses.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes. 

## License

This project is licensed under the MIT License. See the LICENSE file for details.