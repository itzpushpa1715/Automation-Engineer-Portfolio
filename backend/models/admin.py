from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class AdminUser(BaseModel):
    username: str
    email: EmailStr
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AdminLogin(BaseModel):
    username: str
    password: str

class ChangePassword(BaseModel):
    current_password: str
    new_password: str

class UpdateAdminEmail(BaseModel):
    email: EmailStr
