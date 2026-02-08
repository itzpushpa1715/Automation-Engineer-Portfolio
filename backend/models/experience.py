from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Experience(BaseModel):
    title: str
    company: str
    location: str
    period: str
    responsibilities: List[str]
    order: int = 0
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

class ExperienceUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    period: Optional[str] = None
    responsibilities: Optional[List[str]] = None
    order: Optional[int] = None
