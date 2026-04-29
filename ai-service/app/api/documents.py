import os
import tempfile
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List
from langchain_community.document_loaders import PyPDFLoader, CSVLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.db.vector_store import get_vector_store

router = APIRouter()

@router.post("/upload")
async def upload_document(
    user_id: str = Form(...),
    file: UploadFile = File(...)
):
    temp_file_path = None
    try:
        # Create a temporary file to store the upload
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await file.read())
            temp_file_path = tmp.name

        # Choose the right loader
        if file.filename.endswith(".pdf"):
            loader = PyPDFLoader(temp_file_path)
        elif file.filename.endswith(".csv"):
            loader = CSVLoader(temp_file_path)
        elif file.filename.endswith(".txt"):
            loader = TextLoader(temp_file_path)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")

        # Load the document
        docs = loader.load()
        
        # Split into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100
        )
        split_docs = text_splitter.split_documents(docs)
        
        # Add metadata
        for doc in split_docs:
            doc.metadata.update({
                "user_id": user_id,
                "source": file.filename,
                "type": "document"
            })

        # Ingest into Vector Store
        vector_store = get_vector_store()
        vector_store.add_documents(split_docs)

        return {
            "message": f"Document {file.filename} uploaded and processed successfully", 
            "chunks": len(split_docs)
        }
    except Exception as e:
        print(f"Error processing document: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup temp file
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
