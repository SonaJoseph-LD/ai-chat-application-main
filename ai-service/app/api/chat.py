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
        # Generate embedding for the incoming message
        embedding = generate_embedding(request.message)

        # Store message embedding for future turns
        _rag.store_message_embedding(request.user_id, request.message)

        # Retrieve relevant past messages
        context = retrieve_relevant_context(request.user_id, embedding)

        # Build prompt with retrieved context
        prompt = f"{context}\nUser: {request.message}\nAI:"

        # Call the LLM API
        ai_response = await call_llm_api(prompt)

        return ChatResponse(response=ai_response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
