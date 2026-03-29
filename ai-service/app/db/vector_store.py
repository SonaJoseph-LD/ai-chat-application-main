from typing import List, Dict
import numpy as np

try:
    import faiss
    FAISS_AVAILABLE = True
except ImportError:
    FAISS_AVAILABLE = False

class VectorStore:
    def __init__(self, dimension: int):
        self.dimension = dimension
        if FAISS_AVAILABLE:
            self.index = faiss.IndexFlatL2(dimension)
        else:
            self.index = None
        self.embeddings = []
        self.metadata = []

    def add(self, embedding: List[float], meta: Dict):
        self.embeddings.append(embedding)
        self.metadata.append(meta)
        if self.index:
            self.index.add(np.array([embedding], dtype=np.float32))

    def search(self, query_embedding: List[float], k: int = 5) -> List[Dict]:
        if self.index:
            distances, indices = self.index.search(np.array([query_embedding], dtype=np.float32), k)
            results = []
            for idx in indices[0]:
                if idx >= 0 and idx < len(self.metadata):
                    results.append(self.metadata[idx])
            return results
        else:
            # Simple fallback if faiss is not available: use exhaustive search or return empty
            # For now, just return empty list or simple search
            return self.metadata[:k]

    def get_embeddings(self) -> List[List[float]]:
        return self.embeddings

    def get_metadata(self) -> List[Dict]:
        return self.metadata