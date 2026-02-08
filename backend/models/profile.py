from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class Profile(BaseModel):
    name: str
    title: str
    headline: Optional[str] = None
    about: str
    email: EmailStr
    phone: str
    location: str
    linkedin: str
    github: str
    profile_photo: Optional[str] = None
    resume_url: Optional[str] = None
    updated_at: datetime = datetime.utcnow()

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    headline: Optional[str] = None
    about: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
