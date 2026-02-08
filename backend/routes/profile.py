from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from models.profile import Profile, ProfileUpdate
from routes.auth import get_current_admin, get_db
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
from utils.file_upload import save_upload_file, delete_file
from typing import Optional

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("")
async def get_profile(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get profile data (public)"""
    profile = await db.profile.find_one()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    profile["id"] = str(profile.pop("_id"))
    return profile

@router.put("")
async def update_profile(
    data: ProfileUpdate,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update profile (protected)"""
    update_data = {k: v for k, v in data.dict(exclude_unset=True).items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.profile.update_one({}, {"$set": update_data}, upsert=True)
    
    return {"message": "Profile updated successfully"}

@router.post("/photo")
async def upload_profile_photo(
    file: UploadFile = File(...),
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Upload profile photo"""
    # Delete old photo if exists
    profile = await db.profile.find_one()
    if profile and profile.get("profile_photo"):
        delete_file(profile["profile_photo"])
    
    # Save new photo
    file_path = await save_upload_file(file, "images")
    await db.profile.update_one({}, {"$set": {"profile_photo": file_path}}, upsert=True)
    
    return {"message": "Profile photo uploaded", "url": file_path}

@router.post("/resume")
async def upload_resume(
    file: UploadFile = File(...),
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Upload resume PDF"""
    # Delete old resume if exists
    profile = await db.profile.find_one()
    if profile and profile.get("resume_url"):
        delete_file(profile["resume_url"])
    
    # Save new resume
    file_path = await save_upload_file(file, "documents")
    await db.profile.update_one({}, {"$set": {"resume_url": file_path}}, upsert=True)
    
    return {"message": "Resume uploaded", "url": file_path}
