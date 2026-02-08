from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from models.admin import AdminLogin, ChangePassword, UpdateAdminEmail
from utils.jwt_utils import create_access_token, verify_token
from utils.password import hash_password, verify_password
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Dependency to get database
async def get_db():
    from server import db
    return db

# Dependency to verify JWT token
async def get_current_admin(authorization: Optional[str] = Header(None), db: AsyncIOMotorDatabase = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.split(" ")[1]
    payload = verify_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    username = payload.get("sub")
    admin = await db.admins.find_one({"username": username})
    
    if not admin:
        raise HTTPException(status_code=401, detail="Admin not found")
    
    return admin

@router.post("/login")
async def login(credentials: AdminLogin, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Admin login"""
    admin = await db.admins.find_one({"username": credentials.username})
    
    if not admin or not verify_password(credentials.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Create JWT token
    token = create_access_token(data={"sub": admin["username"]})
    
    return {
        "token": token,
        "user": {
            "id": str(admin["_id"]),
            "username": admin["username"],
            "email": admin["email"]
        }
    }

@router.post("/change-password")
async def change_password(
    data: ChangePassword,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Change admin password"""
    # Verify current password
    if not verify_password(data.current_password, admin["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Hash new password and update
    new_hash = hash_password(data.new_password)
    await db.admins.update_one(
        {"_id": admin["_id"]},
        {"$set": {"password_hash": new_hash, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": "Password changed successfully"}

@router.put("/email")
async def update_email(
    data: UpdateAdminEmail,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update admin email"""
    await db.admins.update_one(
        {"_id": admin["_id"]},
        {"$set": {"email": data.email, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": "Email updated successfully"}

@router.post("/logout")
async def logout(admin = Depends(get_current_admin)):
    """Logout (client should delete token)"""
    return {"message": "Logged out successfully"}
