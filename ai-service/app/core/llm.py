from typing import List, Dict, Any
import requests
import os

class LLMClient:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY", "dummy-key")
        self.api_url = "https://api.openai.com/v1/chat/completions"

    async def generate_response(self, prompt: str, temperature: float = 0.7) -> str:
        # Simplified for mock purposes if API key is not real
        if self.api_key == "dummy-key":
            return f"This is a mock response from the AI for your prompt: {prompt[:50]}..."

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature
        }

        # Note: Using requests synchronously here for simplicity, 
        # but it should ideally be async in a real app.
        try:
            response = requests.post(self.api_url, headers=headers, json=payload)
            response.raise_for_status()
            return response.json()['choices'][0]['message']['content']
        except Exception as e:
            return f"Error calling LLM: {str(e)}"

# Global instance of the client
_llm_client = LLMClient()

async def call_llm_api(prompt: str) -> str:
    """Top-level function to call the LLM API."""
    return await _llm_client.generate_response(prompt)