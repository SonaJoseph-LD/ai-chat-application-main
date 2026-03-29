from typing import List, Dict
import numpy as np
import faiss

class VectorStore:
    def __init__(self, dimension: int):
        self.dimension = dimension
        self.index = faiss.IndexFlatL2(dimension)
        self.embeddings = []
        self.metadata = []

    def add(self, embedding: List[float], meta: Dict):
        self.embeddings.append(embedding)
        self.metadata.append(meta)
        self.index.add(np.array([embedding], dtype=np.float32))

    def search(self, query_embedding: List[float], k: int = 5) -> List[Dict]:
        distances, indices = self.index.search(np.array([query_embedding], dtype=np.float32), k)
        results = []
        for idx in indices[0]:
            if idx >= 0:
                results.append(self.metadata[idx])
        return results

    def get_embeddings(self) -> List[List[float]]:
        return self.embeddings

    def get_metadata(self) -> List[Dict]:
        return self.metadata