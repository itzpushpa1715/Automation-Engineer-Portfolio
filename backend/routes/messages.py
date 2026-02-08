from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from models.message import Message, MessageCreate
from routes.auth import get_current_admin, get_db
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
from utils.email import send_contact_notification

router = APIRouter(prefix="/messages", tags=["Messages"])

@router.get("")
async def get_messages(
    status: str = None,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all messages (protected)"""
    query = {"status": status} if status else {}
    messages = await db.messages.find(query).sort("created_at", -1).to_list(1000)
    for message in messages:
        message["id"] = str(message.pop("_id"))
    return messages

@router.post("")
async def create_message(
    message: MessageCreate,
    background_tasks: BackgroundTasks,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Submit contact form (public) - sends email notification"""
    message_dict = message.dict()
    message_dict["status"] = "unread"
    message_dict["created_at"] = datetime.utcnow()
    message_dict["read_at"] = None
    
    result = await db.messages.insert_one(message_dict)
    
    # Send email notification in background
    background_tasks.add_task(
        send_contact_notification,
        message.name,
        message.email,
        message.message
    )
    
    return {"message": "Message sent successfully", "id": str(result.inserted_id)}

@router.patch("/{message_id}/read")
async def mark_as_read(
    message_id: str,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Mark message as read (protected)"""
    result = await db.messages.update_one(
        {"_id": ObjectId(message_id)},
        {"$set": {"status": "read", "read_at": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    
    return {"message": "Marked as read"}

@router.patch("/{message_id}/unread")
async def mark_as_unread(
    message_id: str,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Mark message as unread (protected)"""
    result = await db.messages.update_one(
        {"_id": ObjectId(message_id)},
        {"$set": {"status": "unread", "read_at": None}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    
    return {"message": "Marked as unread"}

@router.delete("/{message_id}")
async def delete_message(
    message_id: str,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete message (protected)"""
    result = await db.messages.delete_one({"_id": ObjectId(message_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    
    return {"message": "Message deleted successfully"}
