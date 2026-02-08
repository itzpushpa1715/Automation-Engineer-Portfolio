# Backend Integration Contracts

## Overview
Full-stack portfolio website with comprehensive admin panel for content management. Frontend uses mock data currently - backend will replace all mock data with MongoDB + REST APIs.

---

## Authentication & Security

### JWT Authentication
- **POST /api/auth/login** - Admin login
  - Input: `{ username, password }`
  - Output: `{ token, user: { id, username, email } }`
  
- **POST /api/auth/change-password** - Change admin password
  - Input: `{ currentPassword, newPassword }`
  - Headers: `Authorization: Bearer <token>`
  
- **POST /api/auth/logout** - Logout (invalidate token)
  - Headers: `Authorization: Bearer <token>`

### Admin User Model
```python
{
  "_id": ObjectId,
  "username": str,
  "email": str,
  "password_hash": str,  # hashed with bcrypt
  "created_at": datetime,
  "updated_at": datetime
}
```

---

## 1. Personal Profile Management

### API Endpoints
- **GET /api/profile** - Get profile data (public)
- **PUT /api/profile** - Update profile (protected)
  - Input: `{ name, title, headline, about, email, phone, location, linkedin, github }`
  - File upload: `profile_photo` (multipart/form-data)

- **POST /api/profile/resume** - Upload/replace CV
  - File upload: `resume` (PDF only)
  
- **GET /api/profile/resume** - Download current CV

### Profile Model
```python
{
  "_id": ObjectId,
  "name": str,
  "title": str,
  "headline": str,  # Short value statement
  "about": str,  # About me description
  "email": str,
  "phone": str,
  "location": str,
  "linkedin": str,
  "github": str,
  "profile_photo": str,  # URL/path to uploaded image
  "resume_url": str,  # URL/path to CV PDF
  "updated_at": datetime
}
```

---

## 2. Skills Management

### API Endpoints
- **GET /api/skills** - Get all skills (public)
- **POST /api/skills** - Add skill (protected)
  - Input: `{ name, category, order }`
  
- **PUT /api/skills/:id** - Update skill (protected)
- **DELETE /api/skills/:id** - Delete skill (protected)
- **PUT /api/skills/reorder** - Reorder skills (protected)
  - Input: `{ skills: [{ id, order }] }`

### Skill Categories
- Automation
- AI & ML
- Programming
- Design Tools
- Testing & Analytics
- Industry 4.0
- Soft Skills

### Skills Model
```python
{
  "_id": ObjectId,
  "name": str,
  "category": str,  # One of the categories above
  "order": int,  # For custom ordering
  "created_at": datetime,
  "updated_at": datetime
}
```

---

## 3. Projects Management (Core Feature)

### API Endpoints
- **GET /api/projects** - Get all projects (with optional filter: `?visible=true`)
- **GET /api/projects/:id** - Get single project
- **POST /api/projects** - Create project (protected)
  - Multipart form data with image upload
  
- **PUT /api/projects/:id** - Update project (protected)
- **DELETE /api/projects/:id** - Delete project (protected)
- **PATCH /api/projects/:id/visibility** - Toggle visibility (protected)
  - Input: `{ visible: boolean }`

### Projects Model
```python
{
  "_id": ObjectId,
  "title": str,
  "problem_statement": str,
  "description": str,
  "technologies": [str],  # Array of tech names
  "role": str,
  "outcome": str,
  "image_url": str,  # Uploaded project thumbnail
  "status": str,  # "Completed", "In Progress", "Planned"
  "visible": bool,  # Show/hide on frontend
  "order": int,  # Custom ordering
  "created_at": datetime,
  "updated_at": datetime
}
```

---

## 4. Experience Management

### API Endpoints
- **GET /api/experience** - Get all experiences (public)
- **POST /api/experience** - Add experience (protected)
- **PUT /api/experience/:id** - Update experience (protected)
- **DELETE /api/experience/:id** - Delete experience (protected)

### Experience Model
```python
{
  "_id": ObjectId,
  "title": str,  # Job title
  "company": str,
  "location": str,
  "period": str,  # "03/2023 – 08/2023"
  "responsibilities": [str],  # Array of achievements
  "order": int,
  "created_at": datetime,
  "updated_at": datetime
}
```

---

## 5. Education Management

### API Endpoints
- **GET /api/education** - Get all education (public)
- **POST /api/education** - Add education (protected)
- **PUT /api/education/:id** - Update education (protected)
- **DELETE /api/education/:id** - Delete education (protected)

### Education Model
```python
{
  "_id": ObjectId,
  "degree": str,
  "institution": str,
  "field_of_study": str,
  "location": str,
  "period": str,  # "08/2024 – Present"
  "description": str,
  "highlights": [str],  # Key courses/achievements
  "order": int,
  "created_at": datetime,
  "updated_at": datetime
}
```

---

## 6. Certifications Management

### API Endpoints
- **GET /api/certifications** - Get all certifications (public)
- **POST /api/certifications** - Add certification (protected)
  - Optional file upload for certificate PDF
  
- **PUT /api/certifications/:id** - Update certification (protected)
- **DELETE /api/certifications/:id** - Delete certification (protected)

### Certifications Model
```python
{
  "_id": ObjectId,
  "name": str,
  "issuing_organization": str,
  "year": str,  # "2025" or "2024-2025"
  "certificate_url": str,  # Optional: link or uploaded file
  "order": int,
  "created_at": datetime,
  "updated_at": datetime
}
```

---

## 7. Contact Messages

### API Endpoints
- **GET /api/messages** - Get all messages (protected)
  - Query params: `?status=unread` or `?status=read`
  
- **GET /api/messages/:id** - Get single message (protected)
- **PATCH /api/messages/:id/read** - Mark as read (protected)
- **PATCH /api/messages/:id/unread** - Mark as unread (protected)
- **DELETE /api/messages/:id** - Delete message (protected)
- **POST /api/messages** - Submit contact form (public)
  - Input: `{ name, email, message }`
  - **Email Notification**: Send email to `thepushpaco@outlook.com`

### Messages Model
```python
{
  "_id": ObjectId,
  "name": str,
  "email": str,
  "message": str,
  "status": str,  # "unread" or "read"
  "created_at": datetime,
  "read_at": datetime  # nullable
}
```

### Email Integration
- Use SMTP or email service (SendGrid, AWS SES, etc.)
- Send notification to: **thepushpaco@outlook.com**
- Email template:
  ```
  Subject: New Portfolio Contact Message
  
  From: {name} ({email})
  
  Message:
  {message}
  
  ---
  Received: {timestamp}
  ```

---

## 8. Website Settings (MVP)

### API Endpoints
- **GET /api/settings** - Get site settings (public)
- **PUT /api/settings** - Update settings (protected)

### Settings Model
```python
{
  "_id": ObjectId,
  "site_title": str,
  "meta_description": str,
  "footer_text": str,
  "sections_enabled": {
    "projects": bool,
    "skills": bool,
    "experience": bool,
    "education": bool,
    "certifications": bool,
    "contact": bool
  },
  "updated_at": datetime
}
```

---

## Frontend Integration Changes

### Files to Update

1. **/app/frontend/src/mock.js**
   - **REMOVE**: All mock data
   - **REPLACE**: With API service calls

2. **/app/frontend/src/services/api.js** (NEW)
   - Create axios instance with base URL
   - All API call functions
   - Auth token management

3. **/app/frontend/src/context/AuthContext.jsx** (NEW)
   - JWT token storage (localStorage)
   - Login/logout functions
   - Protected route wrapper

4. **/app/frontend/src/pages/Home.jsx**
   - Replace mock data imports with API calls
   - Use `useEffect` to fetch data on mount
   - Handle loading states

5. **/app/frontend/src/pages/AdminDashboard.jsx**
   - Complete CRUD implementation
   - File upload handling
   - Message management
   - Profile editing

---

## File Upload Strategy

### Storage
- **Development**: Local filesystem in `/app/backend/uploads/`
- **Production**: Cloud storage (AWS S3, Cloudinary, etc.)

### Endpoints
- **POST /api/upload/image** - Upload single image
- **POST /api/upload/resume** - Upload PDF resume
- **POST /api/upload/certificate** - Upload certificate

### File Handling
- Max file size: 5MB for images, 10MB for PDFs
- Allowed formats: 
  - Images: jpg, jpeg, png, webp
  - Documents: pdf only
- Generate unique filenames (UUID)
- Return public URL after upload

---

## Environment Variables (.env)

```
# MongoDB
MONGO_URL=mongodb://localhost:27017/portfolio
DB_NAME=portfolio_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=7d

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@portfolio.com
ADMIN_EMAIL=thepushpaco@outlook.com

# File Upload
UPLOAD_DIR=/app/backend/uploads
MAX_FILE_SIZE=10485760  # 10MB in bytes

# Admin (Initial Setup)
ADMIN_USERNAME=admin
ADMIN_EMAIL=thepushpaco@outlook.com
ADMIN_PASSWORD=admin123  # Change after first login
```

---

## Implementation Order

### Phase 1: Backend Core
1. ✅ Setup MongoDB models
2. ✅ Auth endpoints (login, change password)
3. ✅ Profile API
4. ✅ Skills API
5. ✅ Projects API (with file upload)
6. ✅ Experience API
7. ✅ Education API
8. ✅ Certifications API
9. ✅ Messages API + Email notification

### Phase 2: Frontend Integration
1. ✅ API service layer
2. ✅ Auth context + protected routes
3. ✅ Update Home page to use APIs
4. ✅ Complete Admin Dashboard CRUD
5. ✅ File upload components
6. ✅ Message management UI

### Phase 3: Testing
1. ✅ Backend API testing
2. ✅ Frontend integration testing
3. ✅ File upload testing
4. ✅ Email notification testing

---

## Success Criteria

✅ Admin can login with JWT authentication  
✅ Admin can update personal profile and upload photo  
✅ Admin can manage all skills with categories  
✅ Admin can CRUD projects with images and visibility toggle  
✅ Admin can manage experience and education  
✅ Admin can manage certifications  
✅ Admin can view and manage contact messages  
✅ Contact form sends email to thepushpaco@outlook.com  
✅ All frontend data comes from MongoDB (no mock data)  
✅ File uploads work for images and PDFs  
✅ JWT tokens protect admin routes  

---

## Notes

- All protected routes require `Authorization: Bearer <token>` header
- Image URLs should be absolute paths or cloud URLs
- Email notifications should be async (don't block API response)
- Implement proper error handling and validation
- Use MongoDB transactions where appropriate
- Add indexes on frequently queried fields
