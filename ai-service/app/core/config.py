import os

class Config:
    """Configuration settings for the AI service."""
    
    # FastAPI settings
    TITLE = "AI Chat Service"
    VERSION = "1.0.0"
    
    # OpenAI API settings
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
    
    # Database settings
    VECTOR_DB_URL = os.getenv("VECTOR_DB_URL", "sqlite:///./vector_store.db")
    
    # CORS settings
    ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")  # Comma-separated list of allowed origins
    
    # Logging settings
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")