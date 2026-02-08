from fastapi import APIRouter, HTTPException, Depends
from models.experience import Experience, ExperienceUpdate
from routes.auth import get_current_admin, get_db
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/experience", tags=["Experience"])

@router.get("")
async def get_experiences(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all experiences (public)"""
    experiences = await db.experience.find().sort("order", 1).to_list(1000)
    for exp in experiences:
        exp["id"] = str(exp.pop("_id"))
    return experiences

@router.post("")
async def create_experience(
    experience: Experience,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create experience (protected)"""
    exp_dict = experience.dict()
    result = await db.experience.insert_one(exp_dict)
    exp_dict["id"] = str(result.inserted_id)
    return exp_dict

@router.put("/{exp_id}")
async def update_experience(
    exp_id: str,
    data: ExperienceUpdate,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update experience (protected)"""
    update_data = {k: v for k, v in data.dict(exclude_unset=True).items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.experience.update_one(
        {"_id": ObjectId(exp_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    return {"message": "Experience updated successfully"}

@router.delete("/{exp_id}")
async def delete_experience(
    exp_id: str,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete experience (protected)"""
    result = await db.experience.delete_one({"_id": ObjectId(exp_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    return {"message": "Experience deleted successfully"}
