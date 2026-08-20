FROM python:3.9-slim
WORKDIR /app

# Install system dependencies needed for compilation (e.g. gcc, g++)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install poetry
RUN pip install --no-cache-dir poetry

# Configure poetry to install packages directly to system (no virtualenv inside docker)
RUN poetry config virtualenvs.create false

# Copy dependency configuration
COPY pyproject.toml poetry.lock* ./

# Install dependencies (without dev dependencies and without root app packaging)
RUN poetry install --no-root --no-dev --no-interaction --no-ansi

# Pre-download and cache the sentence-transformers model during the build stage
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Copy application files
COPY . .

EXPOSE 8000

# Run FastAPI app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
