from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Education(BaseModel):
    degree: str
    institution: str
    field_of_study: Optional[str] = None
    location: str
    period: str
    description: str
    highlights: List[str] = []
    order: int = 0
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

class EducationUpdate(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    field_of_study: Optional[str] = None
    location: Optional[str] = None
    period: Optional[str] = None
    description: Optional[str] = None
    highlights: Optional[List[str]] = None
    order: Optional[int] = None
