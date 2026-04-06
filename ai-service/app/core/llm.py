from typing import List, Dict, Any
import requests
import os

class LLMClient:
    def __init__(self):
        # Prefer environment variable over hardcoded key
        self.api_key = os.getenv("OPENAI_API_KEY", "")
        
        # Check if we should use local AI (Ollama) or OpenAI
        if self.api_key and not self.api_key.startswith("dummy"):
            self.api_url = "https://api.openai.com/v1/chat/completions"
            self.model = "gpt-3.5-turbo"
        else:
            self.api_url = "http://localhost:11434/api/chat"
            self.model = "tinyllama"
            print(f"Using local Ollama at {self.api_url}")

    async def generate_response(self, prompt: str, temperature: float = 0.7) -> str:
        headers = {
            "Content-Type": "application/json"
        }
        
        if self.api_key and "openai.com" in self.api_url:
            headers["Authorization"] = f"Bearer {self.api_key}"

        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
            "stream": False
        }

        try:
            # Set a timeout so the app doesn't hang if the AI is slow
            response = requests.post(self.api_url, headers=headers, json=payload, timeout=60)
            response.raise_for_status()
            return response.json()['message']['content']
        except Exception as e:
            # If we hit a 429 or other error with OpenAI, let the user know
            if "openai.com" in self.api_url:
                return f"Error from OpenAI (Check billing/quota): {str(e)}"
            else:
                return f"Error: Local AI (Ollama) not responding. Is it running? Details: {str(e)}"

# Global instance of the client
_llm_client = LLMClient()

async def call_llm_api(prompt: str) -> str:
    """Top-level function to call the LLM API."""
    return await _llm_client.generate_response(prompt)
