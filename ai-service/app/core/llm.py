import os
from typing import Optional
from langchain_openai import ChatOpenAI
from langchain_community.chat_models import ChatOllama
from langchain_core.language_models.chat_models import BaseChatModel

class LLMProvider:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY", "")
        
        if self.api_key and not self.api_key.startswith("dummy"):
            print("Using LangChain ChatOpenAI")
            self.llm = ChatOpenAI(
                model="gpt-3.5-turbo",
                temperature=0.7,
                openai_api_key=self.api_key
            )
        else:
            print("Using LangChain ChatOllama")
            # Default to local Ollama
            self.llm = ChatOllama(
                model="tinyllama",
                base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
                temperature=0.7
            )

    def get_llm(self) -> BaseChatModel:
        return self.llm

# Global instance
_provider = LLMProvider()

def get_llm() -> BaseChatModel:
    """Returns the LangChain Chat Model instance."""
    return _provider.get_llm()

async def call_llm_api(prompt: str) -> str:
    """
    Compatibility function for existing code.
    Calls the LLM with a simple string prompt and returns the string response.
    """
    llm = get_llm()
    response = await llm.ainvoke(prompt)
    return response.content
