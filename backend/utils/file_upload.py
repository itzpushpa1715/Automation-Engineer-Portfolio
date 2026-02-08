import os
import uuid
from fastapi import UploadFile, HTTPException
from typing import Optional
import shutil
from pathlib import Path

UPLOAD_DIR = os.environ.get('UPLOAD_DIR', '/app/backend/uploads')
MAX_FILE_SIZE = int(os.environ.get('MAX_FILE_SIZE', 10485760))  # 10MB

ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}
ALLOWED_DOCUMENT_EXTENSIONS = {'.pdf'}

def get_file_extension(filename: str) -> str:
    return Path(filename).suffix.lower()

def generate_unique_filename(original_filename: str) -> str:
    extension = get_file_extension(original_filename)
    unique_id = str(uuid.uuid4())
    return f"{unique_id}{extension}"

async def save_upload_file(upload_file: UploadFile, subfolder: str = 'images') -> str:
    """Save uploaded file and return the file path"""
    
    # Validate file extension
    extension = get_file_extension(upload_file.filename)
    
    if subfolder == 'images':
        if extension not in ALLOWED_IMAGE_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Invalid image format. Allowed: jpg, jpeg, png, webp")
    elif subfolder == 'documents':
        if extension not in ALLOWED_DOCUMENT_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Invalid document format. Only PDF allowed")
    
    # Create upload directory if it doesn't exist
    upload_path = Path(UPLOAD_DIR) / subfolder
    upload_path.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    filename = generate_unique_filename(upload_file.filename)
    file_path = upload_path / filename
    
    # Save file
    try:
        with open(file_path, 'wb') as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    finally:
        upload_file.file.close()
    
    # Return relative path for URL
    return f"/uploads/{subfolder}/{filename}"

def delete_file(file_path: str):
    """Delete a file from the filesystem"""
    try:
        if file_path and file_path.startswith('/uploads/'):
            full_path = Path(UPLOAD_DIR) / file_path.replace('/uploads/', '')
            if full_path.exists():
                full_path.unlink()
    except Exception as e:
        print(f"Error deleting file {file_path}: {str(e)}")
