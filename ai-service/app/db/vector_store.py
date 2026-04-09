from typing import List, Dict, Optional
import os
import uuid
try:
    from qdrant_client import QdrantClient
    from qdrant_client.http.models import Distance, VectorParams, PointStruct
    QDRANT_AVAILABLE = True
except ImportError:
    QDRANT_AVAILABLE = False

class VectorStore:
    def __init__(self, dimension: int, collection_name: str = "messages"):
        self.dimension = dimension
        self.collection_name = collection_name
        self.client = None
        
        if QDRANT_AVAILABLE:
            qdrant_host = os.getenv("QDRANT_HOST", "localhost")
            qdrant_port = int(os.getenv("QDRANT_PORT", 6333))
            try:
                # Try to connect to a remote Qdrant instance, fallback to in-memory if it fails
                self.client = QdrantClient(host=qdrant_host, port=qdrant_port)
                # Check if collection exists, if not create it
                collections = self.client.get_collections().collections
                exists = any(c.name == self.collection_name for c in collections)
                if not exists:
                    self.client.create_collection(
                        collection_name=self.collection_name,
                        vectors_config=VectorParams(size=dimension, distance=Distance.COSINE),
                    )
                print(f"Connected to Qdrant at {qdrant_host}:{qdrant_port}")
            except Exception as e:
                print(f"Failed to connect to Qdrant, using in-memory Qdrant: {e}")
                self.client = QdrantClient(":memory:")
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=dimension, distance=Distance.COSINE),
                )
        else:
            print("Qdrant client not available, please install 'qdrant-client'")
            self.client = None
            self.embeddings = []
            self.metadata = []

    def add(self, embedding: List[float], meta: Dict):
        print(f"   [VectorStore] Adding vector with metadata: {meta}")
        if self.client:
            point_id = str(uuid.uuid4())
            self.client.upsert(
                collection_name=self.collection_name,
                points=[
                    PointStruct(
                        id=point_id,
                        vector=embedding,
                        payload=meta
                    )
                ]
            )
        else:
            self.embeddings.append(embedding)
            self.metadata.append(meta)

    def search(self, query_embedding: List[float], k: int = 5) -> List[Dict]:
        print(f"   [VectorStore] Searching for top {k} nearest neighbors")
        if self.client:
            try:
                # Try the newer query_points API first (v1.10+)
                if hasattr(self.client, "query_points"):
                    search_result = self.client.query_points(
                        collection_name=self.collection_name,
                        query=query_embedding,
                        limit=k
                    ).points
                else:
                    # Fallback to the traditional search API
                    search_result = self.client.search(
                        collection_name=self.collection_name,
                        query_vector=query_embedding,
                        limit=k
                    )
                print(f"   [VectorStore] Found {len(search_result)} matches")
                return [hit.payload for hit in search_result]
            except Exception as e:
                print(f"   [VectorStore] Error during search: {e}")
                return []
        else:
            # Simple fallback if qdrant is not available
            return self.metadata[:k]

    def get_embeddings(self) -> List[List[float]]:
        if self.client:
            # This is not efficient for large collections, but for debugging/small scale:
            points = self.client.scroll(collection_name=self.collection_name, with_vectors=True)[0]
            return [p.vector for p in points]
        return self.embeddings

    def get_metadata(self) -> List[Dict]:
        if self.client:
            points = self.client.scroll(collection_name=self.collection_name)[0]
            return [p.payload for p in points]
        return self.metadata