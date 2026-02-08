from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Skill(BaseModel):
    name: str
    category: str
    order: int = 0
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    order: Optional[int] = None
