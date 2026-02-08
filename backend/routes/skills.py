from fastapi import APIRouter, HTTPException, Depends
from models.skill import Skill, SkillUpdate
from routes.auth import get_current_admin, get_db
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
from typing import List

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("")
async def get_skills(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all skills (public)"""
    skills = await db.skills.find().sort("order", 1).to_list(1000)
    for skill in skills:
        skill["id"] = str(skill.pop("_id"))
    return skills

@router.post("")
async def create_skill(
    skill: Skill,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create skill (protected)"""
    skill_dict = skill.dict()
    result = await db.skills.insert_one(skill_dict)
    skill_dict["id"] = str(result.inserted_id)
    return skill_dict

@router.put("/{skill_id}")
async def update_skill(
    skill_id: str,
    data: SkillUpdate,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update skill (protected)"""
    update_data = {k: v for k, v in data.dict(exclude_unset=True).items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.skills.update_one(
        {"_id": ObjectId(skill_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    return {"message": "Skill updated successfully"}

@router.delete("/{skill_id}")
async def delete_skill(
    skill_id: str,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete skill (protected)"""
    result = await db.skills.delete_one({"_id": ObjectId(skill_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    return {"message": "Skill deleted successfully"}
