from typing import List
import numpy as np

try:
    from sklearn.metrics.pairwise import cosine_similarity
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    def cosine_similarity(a, b):
        # Fallback simple cosine similarity
        a = np.array(a)
        b = np.array(b)
        if len(a.shape) == 1: a = a.reshape(1, -1)
        if len(b.shape) == 1: b = b.reshape(1, -1)
        dot_product = np.dot(a, b.T)
        norm_a = np.linalg.norm(a, axis=1, keepdims=True)
        norm_b = np.linalg.norm(b, axis=1, keepdims=True)
        return dot_product / (norm_a * norm_b.T)

class EmbeddingService:
    def __init__(self, model=None):
        self.model = model
        self.embeddings = {}

    def generate_embedding(self, text: str) -> List[float]:
        """Generate an embedding for the given text using the specified model."""
        if self.model is None:
            # Return a dummy embedding if no model is provided
            return [0.0] * 384
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

        embeddings_dict = self.embeddings[conversation_id]
        if not embeddings_dict:
            return []
            
        message_ids = list(embeddings_dict.keys())
        embeddings_list = list(embeddings_dict.values())
        
        similarities = cosine_similarity([query_embedding], embeddings_list)[0]
        similar_indices = np.argsort(similarities)[-top_n:][::-1]
        
        return [message_ids[i] for i in similar_indices]

# Global instance of the service
_service = EmbeddingService()

def generate_embedding(text: str) -> List[float]:
    """Top-level function to generate an embedding for the given text."""
    return _service.generate_embedding(text)
