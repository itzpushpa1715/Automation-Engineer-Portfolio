from fastapi import APIRouter, HTTPException, Depends
from models.certification import Certification, CertificationUpdate
from routes.auth import get_current_admin, get_db
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/certifications", tags=["Certifications"])

@router.get("")
async def get_certifications(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all certifications (public)"""
    certifications = await db.certifications.find().sort("order", 1).to_list(1000)
    for cert in certifications:
        cert["id"] = str(cert.pop("_id"))
    return certifications

@router.post("")
async def create_certification(
    certification: Certification,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create certification (protected)"""
    cert_dict = certification.dict()
    result = await db.certifications.insert_one(cert_dict)
    cert_dict["id"] = str(result.inserted_id)
    return cert_dict

@router.put("/{cert_id}")
async def update_certification(
    cert_id: str,
    data: CertificationUpdate,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update certification (protected)"""
    update_data = {k: v for k, v in data.dict(exclude_unset=True).items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.certifications.update_one(
        {"_id": ObjectId(cert_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Certification not found")
    
    return {"message": "Certification updated successfully"}

@router.delete("/{cert_id}")
async def delete_certification(
    cert_id: str,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete certification (protected)"""
    result = await db.certifications.delete_one({"_id": ObjectId(cert_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Certification not found")
    
    return {"message": "Certification deleted successfully"}
