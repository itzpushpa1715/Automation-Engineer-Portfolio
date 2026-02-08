from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class Message(BaseModel):
    name: str
    email: EmailStr
    message: str
    status: str = "unread"
    created_at: datetime = datetime.utcnow()
    read_at: Optional[datetime] = None

class MessageCreate(BaseModel):
    name: str
    email: EmailStr
    message: str
