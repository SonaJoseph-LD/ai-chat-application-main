from typing import List, Dict, Any
import requests
import os

class LLMClient:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.api_url = "https://api.openai.com/v1/chat/completions"

    def generate_response(self, messages: List[Dict[str, Any]], temperature: float = 0.7) -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": messages,
            "temperature": temperature,
            "stream": True
        }

        response = requests.post(self.api_url, headers=headers, json=payload, stream=True)
        response.raise_for_status()

        return self.stream_response(response)

    def stream_response(self, response) -> str:
        full_response = ""
        for line in response.iter_lines():
            if line:
                delta = line.decode('utf-8').strip()
                if delta.startswith("data:"):
                    content = delta[5:].strip()
                    if content == "[DONE]":
                        break
                    full_response += content
        return full_response.strip()