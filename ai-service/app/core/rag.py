from typing import List, Dict
from app.db.vector_store import VectorStore
from app.core.embeddings import generate_embedding

class RAG:
    def __init__(self, vector_store: VectorStore):
        self.vector_store = vector_store

    def store_message_embedding(self, conversation_id: str, message: str) -> None:
        embedding = generate_embedding(message)
        self.vector_store.store_embedding(conversation_id, message, embedding)

    def retrieve_relevant_context(self, query: str, top_k: int = 5) -> List[Dict[str, str]]:
        query_embedding = generate_embedding(query)
        relevant_messages = self.vector_store.query_similar_embeddings(query_embedding, top_k)
        return relevant_messages

    def build_prompt_with_context(self, query: str) -> str:
        relevant_context = self.retrieve_relevant_context(query)
        context_messages = "\n".join([msg['message'] for msg in relevant_context])
        prompt = f"Context:\n{context_messages}\n\nUser Query: {query}"
        return prompt