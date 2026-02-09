from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from models.project import Project, ProjectUpdate
from routes.auth import get_current_admin, get_db
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
from utils.file_upload import save_upload_file, delete_file
from typing import Optional, List
import json

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("")
async def get_projects(
    visible: Optional[bool] = None,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all projects (public, optionally filter by visibility)"""
    query = {"visible": True} if visible else {}
    projects = await db.projects.find(query).sort("order", 1).to_list(1000)
    for project in projects:
        project["id"] = str(project.pop("_id"))
    return projects

@router.get("/{project_id}")
async def get_project(project_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get single project"""
    project = await db.projects.find_one({"_id": ObjectId(project_id)})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project["id"] = str(project.pop("_id"))
    return project

@router.post("")
async def create_project(
    title: str = Form(...),
    description: str = Form(...),
    technologies: str = Form(...),
    problem_statement: Optional[str] = Form(None),
    role: Optional[str] = Form(None),
    outcome: Optional[str] = Form(None),
    status: str = Form("Completed"),
    visible: bool = Form(True),
    project_url: Optional[str] = Form(None),
    github_url: Optional[str] = Form(None),
    image_url: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create project with image upload (protected)"""
    # Handle image upload or use provided URL
    final_image_url = image_url
    if image:
        final_image_url = await save_upload_file(image, "images")
    
    # Parse technologies JSON array
    tech_list = json.loads(technologies) if technologies else []
    
    project_data = {
        "title": title,
        "description": description,
        "technologies": tech_list,
        "problem_statement": problem_statement,
        "role": role,
        "outcome": outcome,
        "status": status,
        "visible": visible,
        "image_url": final_image_url,
        "project_url": project_url,
        "github_url": github_url,
        "order": 0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.projects.insert_one(project_data)
    project_data["id"] = str(result.inserted_id)
    return project_data

@router.put("/{project_id}")
async def update_project(
    project_id: str,
    data: ProjectUpdate,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update project (protected)"""
    update_data = {k: v for k, v in data.dict(exclude_unset=True).items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.projects.update_one(
        {"_id": ObjectId(project_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"message": "Project updated successfully"}

@router.patch("/{project_id}/visibility")
async def toggle_visibility(
    project_id: str,
    visible: bool,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Toggle project visibility (protected)"""
    result = await db.projects.update_one(
        {"_id": ObjectId(project_id)},
        {"$set": {"visible": visible, "updated_at": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"message": "Visibility updated successfully"}

@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    admin = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete project (protected)"""
    # Get project to delete image file
    project = await db.projects.find_one({"_id": ObjectId(project_id)})
    if project and project.get("image_url"):
        delete_file(project["image_url"])
    
    result = await db.projects.delete_one({"_id": ObjectId(project_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"message": "Project deleted successfully"}
