from typing import List, Dict, Any
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from qdrant_client.http import models as rest
from app.db.vector_store import get_vector_store
from app.core.llm import get_llm

class RAGService:
    def __init__(self):
        self.vector_store = get_vector_store()
        self.llm = get_llm()
        
        # Define the prompt template
        self.template = """You are a helpful AI assistant. Use the following context to answer the user's question.
If the context is empty or doesn't contain the answer, use your general knowledge but mention that the context didn't provide specific information.

Context:
{context}

User Question: {question}
Answer:"""
        self.prompt = ChatPromptTemplate.from_template(self.template)

    def get_retriever(self, user_id: str):
        # Use Qdrant's filter for user isolation
        qdrant_filter = rest.Filter(
            must=[
                rest.FieldCondition(
                    key="metadata.user_id",
                    match=rest.MatchValue(value=user_id),
                )
            ]
        )
        return self.vector_store.as_retriever(
            search_kwargs={
                "filter": qdrant_filter,
                "k": 5
            }
        )

    def build_chain(self, user_id: str):
        retriever = self.get_retriever(user_id)
        
        def format_docs(docs):
            doc_context = []
            chat_context = []
            for doc in docs:
                content = doc.page_content
                metadata = doc.metadata
                if metadata.get('type') == 'document':
                    doc_context.append(f"[From document {metadata.get('source', 'unknown')}]: {content}")
                else:
                    chat_context.append(content)
            
            context_str = ""
            if doc_context:
                context_str += "Context from uploaded documents:\n" + "\n".join(doc_context) + "\n\n"
            if chat_context:
                context_str += "Context from previous messages:\n" + "\n".join(chat_context)
            return context_str

        chain = (
            {"context": retriever | format_docs, "question": RunnablePassthrough()}
            | self.prompt
            | self.llm
            | StrOutputParser()
        )
        return chain

# Global instance
_rag_service = RAGService()

def store_message_embedding(user_id: str, message: str) -> None:
    """Compatibility function to store a message."""
    vector_store = get_vector_store()
    vector_store.add_texts(
        texts=[message],
        metadatas=[{"user_id": user_id, "type": "chat"}]
    )

def retrieve_relevant_context(user_id: str, query: str, top_k: int = 5) -> str:
    """Compatibility function to retrieve context."""
    vector_store = get_vector_store()
    
    qdrant_filter = rest.Filter(
        must=[
            rest.FieldCondition(
                key="metadata.user_id",
                match=rest.MatchValue(value=user_id),
            )
        ]
    )
    
    docs = vector_store.similarity_search(query, k=top_k, filter=qdrant_filter)
    
    doc_context = []
    chat_context = []
    for doc in docs:
        content = doc.page_content
        metadata = doc.metadata
        if metadata.get('type') == 'document':
            doc_context.append(f"[From document {metadata.get('source', 'unknown')}]: {content}")
        else:
            chat_context.append(content)
            
    context_str = ""
    if doc_context:
        context_str += "Context from uploaded documents:\n" + "\n".join(doc_context) + "\n\n"
    if chat_context:
        context_str += "Context from previous messages:\n" + "\n".join(chat_context)
        
    return context_str

def get_rag_chain(user_id: str):
    """Returns a ready-to-use LCEL chain for a specific user."""
    return _rag_service.build_chain(user_id)

# For backward compatibility with chat.py which uses _rag.store_message_embedding
class LegacyRAGWrapper:
    def __init__(self, service: RAGService):
        self.service = service
        self.vector_store = service.vector_store

    def store_message_embedding(self, user_id: str, message: str) -> None:
        store_message_embedding(user_id, message)

_rag = LegacyRAGWrapper(_rag_service)
