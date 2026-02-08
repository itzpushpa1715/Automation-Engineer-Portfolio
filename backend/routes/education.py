from fastapi import APIRouter, HTTPException, Depends
from models.education import Education, EducationUpdate
from routes.auth import get_current_admin, get_db
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/education", tags=["Education"])

@router.get("")
async def get_education(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all education (public)"""
    education = await db.education.find().sort("order", 1).to_list(1000)
    for edu in education:
        edu["id"] = str(edu.pop("_id"))
    return education

@router.post("")
async def create_education(
    education: Education,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create education (protected)"""
    edu_dict = education.dict()
    result = await db.education.insert_one(edu_dict)
    edu_dict["id"] = str(result.inserted_id)
    return edu_dict

@router.put("/{edu_id}")
async def update_education(
    edu_id: str,
    data: EducationUpdate,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update education (protected)"""
    update_data = {k: v for k, v in data.dict(exclude_unset=True).items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.education.update_one(
        {"_id": ObjectId(edu_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Education not found")
    
    return {"message": "Education updated successfully"}

@router.delete("/{edu_id}")
async def delete_education(
    edu_id: str,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete education (protected)"""
    result = await db.education.delete_one({"_id": ObjectId(edu_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Education not found")
    
    return {"message": "Education deleted successfully"}
