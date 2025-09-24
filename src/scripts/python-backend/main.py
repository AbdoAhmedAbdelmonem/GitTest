from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
from typing import List, Optional
import uvicorn

# Import the original chatbot functionality
from projectchatbot import DocumentProcessor, ChatBot

app = FastAPI(title="EXPLO Document Processing Backend")

# Enable CORS for web app communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the chatbot system
chatbot = ChatBot()
processor = DocumentProcessor()

class QueryRequest(BaseModel):
    question: str
    language: str = "arabic"
    model: str = "openai"

class ChatResponse(BaseModel):
    answer: str
    sources: List[str] = []
    confidence: float = 0.0

@app.post("/upload-document")
async def upload_document(file: UploadFile = File(...)):
    """Upload and process a document"""
    try:
        # Save uploaded file temporarily
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Process the document
        result = processor.process_document(temp_path)
        
        # Clean up temp file
        os.remove(temp_path)
        
        return {
            "status": "success",
            "message": "Document processed successfully",
            "document_id": result.get("document_id"),
            "chunks": len(result.get("chunks", []))
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query", response_model=ChatResponse)
async def query_documents(request: QueryRequest):
    """Query processed documents"""
    try:
        response = chatbot.get_response(
            question=request.question,
            language=request.language,
            model=request.model
        )
        
        return ChatResponse(
            answer=response.get("answer", ""),
            sources=response.get("sources", []),
            confidence=response.get("confidence", 0.0)
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents")
async def list_documents():
    """List all processed documents"""
    return {"documents": processor.get_document_list()}

@app.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a processed document"""
    try:
        processor.delete_document(document_id)
        return {"status": "success", "message": "Document deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "EXPLO Document Processing Backend"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
