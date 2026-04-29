from typing import List
from langchain_huggingface import HuggingFaceEmbeddings

class EmbeddingService:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        print(f"Loading LangChain HuggingFaceEmbeddings: {model_name}...")
        self.embeddings = HuggingFaceEmbeddings(model_name=model_name)
        print(f"Model loaded.")

    def generate_embedding(self, text: str) -> List[float]:
        """Generate an embedding for the given text."""
        return self.embeddings.embed_query(text)

# Global instance of the service
_service = EmbeddingService()

def generate_embedding(text: str) -> List[float]:
    """Top-level function to generate an embedding for the given text."""
    return _service.generate_embedding(text)

def get_embeddings_model():
    """Returns the LangChain embeddings model instance."""
    return _service.embeddings
