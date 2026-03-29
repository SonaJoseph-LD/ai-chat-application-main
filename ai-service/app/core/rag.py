from typing import List, Dict
from app.db.vector_store import VectorStore
from app.core.embeddings import generate_embedding

class RAG:
    def __init__(self, vector_store: VectorStore):
        self.vector_store = vector_store

    def store_message_embedding(self, conversation_id: str, message: str) -> None:
        embedding = generate_embedding(message)
        self.vector_store.add(embedding, {"message": message, "conversation_id": conversation_id})

    def retrieve_relevant_context(self, query: str, top_k: int = 5) -> List[Dict[str, str]]:
        query_embedding = generate_embedding(query)
        relevant_messages = self.vector_store.search(query_embedding, top_k)
        return relevant_messages

    def build_prompt_with_context(self, query: str) -> str:
        relevant_context = self.retrieve_relevant_context(query)
        context_messages = "\n".join([msg['message'] for msg in relevant_context])
        prompt = f"Context:\n{context_messages}\n\nUser Query: {query}"
        return prompt

# Initialize a default vector store and RAG instance
_vector_store = VectorStore(dimension=384)
_rag = RAG(_vector_store)

def retrieve_relevant_context(user_id: str, query_embedding: List[float], top_k: int = 5) -> str:
    """Top-level function to retrieve context as a formatted string."""
    relevant_messages = _vector_store.search(query_embedding, top_k)
    context_messages = "\n".join([msg['message'] for msg in relevant_messages if 'message' in msg])
    return f"Context from previous messages:\n{context_messages}" if context_messages else ""
