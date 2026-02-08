from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Certification(BaseModel):
    name: str
    issuing_organization: Optional[str] = None
    year: str
    certificate_url: Optional[str] = None
    order: int = 0
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

class CertificationUpdate(BaseModel):
    name: Optional[str] = None
    issuing_organization: Optional[str] = None
    year: Optional[str] = None
    certificate_url: Optional[str] = None
    order: Optional[int] = None
