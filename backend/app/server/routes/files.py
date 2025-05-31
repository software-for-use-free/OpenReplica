"""
Files API routes for session management
"""
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os

router = APIRouter()

class WriteFileRequest(BaseModel):
    path: str
    content: str
    encoding: str = "utf-8"

class FileContent(BaseModel):
    path: str
    content: str
    encoding: str
    size: int

class FileInfo(BaseModel):
    name: str
    path: str
    size: int
    modified: int
    is_directory: bool
    mime_type: str = None

class DirectoryListing(BaseModel):
    path: str
    files: List[FileInfo]
    total_files: int
    total_size: int

@router.get("/{session_id}/list")
async def list_files(session_id: str, path: str = "") -> DirectoryListing:
    """List files in a directory"""
    # Simulate file listing for demo
    demo_files = [
        FileInfo(
            name="main.py",
            path="/workspace/main.py",
            size=1024,
            modified=1640995200,
            is_directory=False,
            mime_type="text/x-python"
        ),
        FileInfo(
            name="requirements.txt",
            path="/workspace/requirements.txt", 
            size=256,
            modified=1640995200,
            is_directory=False,
            mime_type="text/plain"
        ),
        FileInfo(
            name="src",
            path="/workspace/src",
            size=0,
            modified=1640995200,
            is_directory=True
        )
    ]
    
    return DirectoryListing(
        path=path or "/workspace",
        files=demo_files,
        total_files=len(demo_files),
        total_size=sum(f.size for f in demo_files if not f.is_directory)
    )

@router.get("/{session_id}/read")
async def read_file(session_id: str, path: str) -> FileContent:
    """Read file content"""
    # Simulate file reading for demo
    if "main.py" in path:
        content = """#!/usr/bin/env python3
\"\"\"
OpenReplica Demo Application
\"\"\"

def main():
    print("Hello from OpenReplica!")
    print("This is a demo file in your workspace.")
    
    # Your code here
    pass

if __name__ == "__main__":
    main()
"""
    elif "requirements.txt" in path:
        content = """fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
websockets==11.0.0
"""
    else:
        content = f"# File content for {path}\n# This is a demo file\n"
    
    return FileContent(
        path=path,
        content=content,
        encoding="utf-8",
        size=len(content.encode('utf-8'))
    )

@router.post("/{session_id}/write")
async def write_file(session_id: str, data: WriteFileRequest) -> Dict[str, str]:
    """Write file content"""
    # In a real implementation, this would write to the workspace
    return {"message": f"File {data.path} written successfully"}

@router.delete("/{session_id}/delete")
async def delete_file(session_id: str, path: str) -> Dict[str, str]:
    """Delete a file"""
    # In a real implementation, this would delete the file
    return {"message": f"File {path} deleted successfully"}
