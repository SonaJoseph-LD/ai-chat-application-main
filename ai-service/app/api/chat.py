from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from app.core.embeddings import generate_embedding
from app.core.rag import retrieve_relevant_context, _rag
from app.core.llm import call_llm_api

router = APIRouter()

class ChatRequest(BaseModel):
    user_id: str
    message: str

class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        print(f"--- Processing Chat Request ---")
        print(f"User ID: {request.user_id}")
        print(f"Message: {request.message[:50]}...")

        # Generate embedding for the incoming message
        print(f"1. Generating embedding...")
        embedding = generate_embedding(request.message)
        print(f"   Embedding generated (dim: {len(embedding)})")

        # Store message embedding for future turns
        print(f"2. Storing message in Qdrant...")
        _rag.store_message_embedding(request.user_id, request.message)
        print(f"   Message stored successfully")

        # Retrieve relevant past messages
        print(f"3. Retrieving context from Qdrant...")
        context = retrieve_relevant_context(request.user_id, embedding)
        print(f"   Context retrieved: {context[:100]}...")

        # Build prompt with retrieved context
        prompt = f"{context}\nUser: {request.message}\nAI:"
        print(f"4. Calling LLM with prompt...")

        # Call the LLM API
        ai_response = await call_llm_api(prompt)
        print(f"5. AI Response: {ai_response[:50]}...")
        print(f"--- Chat Request Completed ---\n")

        return ChatResponse(response=ai_response)
    except Exception as e:
        print(f"!!! Error in chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

