from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class Settings(BaseModel):
    site_title: str = "Portfolio"
    meta_description: str = "Professional Portfolio"
    footer_text: str = "© 2025. Made with passion"
    sections_enabled: Dict[str, bool] = {
        "projects": True,
        "skills": True,
        "experience": True,
        "education": True,
        "certifications": True,
        "contact": True
    }
    updated_at: datetime = datetime.utcnow()

class SettingsUpdate(BaseModel):
    site_title: Optional[str] = None
    meta_description: Optional[str] = None
    footer_text: Optional[str] = None
    sections_enabled: Optional[Dict[str, bool]] = None
