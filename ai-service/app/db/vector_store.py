import os
from typing import List, Dict, Optional
from qdrant_client import QdrantClient
from langchain_qdrant import QdrantVectorStore
from app.core.embeddings import get_embeddings_model

class VectorStoreProvider:
    def __init__(self, collection_name: str = "messages"):
        self.collection_name = collection_name
        self.embeddings = get_embeddings_model()
        
        qdrant_host = os.getenv("QDRANT_HOST", "localhost")
        qdrant_port = int(os.getenv("QDRANT_PORT", 6333))
        
        try:
            # Try to connect to a remote Qdrant instance
            self.client = QdrantClient(host=qdrant_host, port=qdrant_port, check_compatibility=False)
            # Check if collection exists
            self.client.get_collections()
            print(f"Connected to Qdrant at {qdrant_host}:{qdrant_port}")
        except Exception as e:
            print(f"Failed to connect to Qdrant, using in-memory Qdrant: {e}")
            self.client = QdrantClient(":memory:")

        self.vector_store = QdrantVectorStore(
            client=self.client,
            collection_name=self.collection_name,
            embedding=self.embeddings,
        )

    def get_vector_store(self) -> QdrantVectorStore:
        return self.vector_store

# Global instance
_provider = VectorStoreProvider()

def get_vector_store() -> QdrantVectorStore:
    """Returns the LangChain QdrantVectorStore instance."""
    return _provider.get_vector_store()
