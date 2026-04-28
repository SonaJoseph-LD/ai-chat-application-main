from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List
import io
import pandas as pd
try:
    import pypdf
except ImportError:
    import PyPDF2 as pypdf
from app.core.embeddings import generate_embedding
from app.core.rag import _rag
from app.db.vector_store import VectorStore

router = APIRouter()

@router.post("/upload")
async def upload_document(
    user_id: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        content = await file.read()
        filename = file.filename
        text = ""

        if filename.endswith(".pdf"):
            pdf_reader = pypdf.PdfReader(io.BytesIO(content))
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        elif filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(content))
            text = df.to_string()
        elif filename.endswith(".txt"):
            text = content.decode("utf-8")
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")

        if not text.strip():
            raise HTTPException(status_code=400, detail="Document is empty")

        # Split text into chunks (simple version for now)
        chunks = [text[i:i+1000] for i in range(0, len(text), 1000)]
        
        for chunk in chunks:
            embedding = generate_embedding(chunk)
            _rag.vector_store.add(embedding, {
                "message": chunk, 
                "user_id": user_id, 
                "source": filename,
                "type": "document"
            })

        return {"message": f"Document {filename} uploaded and processed successfully", "chunks": len(chunks)}
    except Exception as e:
        print(f"Error processing document: {e}")
        raise HTTPException(status_code=500, detail=str(e))
