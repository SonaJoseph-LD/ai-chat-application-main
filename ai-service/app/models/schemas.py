from pydantic import BaseModel
from typing import List, Optional

class MessageSchema(BaseModel):
    id: int
    conversation_id: int
    user_id: int
    content: str
    timestamp: str

class ConversationSchema(BaseModel):
    id: int
    user_id: int
    title: str
    messages: List[MessageSchema]

class UserSchema(BaseModel):
    id: int 
    username: str
    email: str

class ChatRequestSchema(BaseModel):
    user_id: int
    conversation_id: int
    message: str

class ChatResponseSchema(BaseModel):
    response: str
    context: Optional[List[MessageSchema]] = None