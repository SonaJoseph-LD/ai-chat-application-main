from typing import List
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class EmbeddingService:
    def __init__(self, model):
        self.model = model
        self.embeddings = {}

    def generate_embedding(self, text: str) -> List[float]:
        """Generate an embedding for the given text using the specified model."""
        return self.model.encode(text).tolist()

    def store_embedding(self, conversation_id: str, message_id: str, embedding: List[float]):
        """Store the embedding for a specific message in a conversation."""
        if conversation_id not in self.embeddings:
            self.embeddings[conversation_id] = {}
        self.embeddings[conversation_id][message_id] = embedding

    def retrieve_similar_embeddings(self, conversation_id: str, query_embedding: List[float], top_n: int = 5) -> List[str]:
        """Retrieve the most similar message embeddings for a given query embedding."""
        if conversation_id not in self.embeddings:
            return []

        embeddings_list = list(self.embeddings[conversation_id].values())
        similarities = cosine_similarity([query_embedding], embeddings_list)[0]
        similar_indices = np.argsort(similarities)[-top_n:][::-1]
        
        return [list(self.embeddings[conversation_id].keys())[i] for i in similar_indices]