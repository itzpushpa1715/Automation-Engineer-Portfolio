from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Project(BaseModel):
    title: str
    problem_statement: Optional[str] = None
    description: str
    technologies: List[str]
    role: Optional[str] = None
    outcome: Optional[str] = None
    image_url: Optional[str] = None
    project_url: Optional[str] = None
    github_url: Optional[str] = None
    status: str = "Completed"
    visible: bool = True
    order: int = 0
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    problem_statement: Optional[str] = None
    description: Optional[str] = None
    technologies: Optional[List[str]] = None
    role: Optional[str] = None
    outcome: Optional[str] = None
    status: Optional[str] = None
    visible: Optional[bool] = None
    order: Optional[int] = None
    project_url: Optional[str] = None
    github_url: Optional[str] = None
    image_url: Optional[str] = None
