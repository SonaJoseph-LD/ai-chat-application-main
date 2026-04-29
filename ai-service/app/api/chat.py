from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.rag import get_rag_chain, _rag

router = APIRouter()

class ChatRequest(BaseModel):
    user_id: str
    message: str

class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        print(f"--- Processing Chat Request (LangChain) ---")
        print(f"User ID: {request.user_id}")

        # 1. Store the incoming message for future context
        # (Using the compatibility wrapper)
        _rag.store_message_embedding(request.user_id, request.message)

        # 2. Get the LangChain LCEL chain for this user
        chain = get_rag_chain(request.user_id)

        # 3. Invoke the chain
        # The chain handles retrieval, prompt formatting, and LLM call
        ai_response = await chain.ainvoke(request.message)
        
        print(f"--- Chat Request Completed ---")
        return ChatResponse(response=ai_response)

    except Exception as e:
        print(f"!!! Error in chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))
