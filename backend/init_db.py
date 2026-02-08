import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from utils.password import hash_password
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Your CV data
PROFILE_DATA = {
    "name": "Pushpa Koirala",
    "title": "Automation & Electrical Engineer",
    "headline": "Crafting innovative automation solutions where technologies meet precision",
    "about": "Automation & Electrical Engineering student with a strong background in Electronics & Artificial Intelligence, Cybersecurity, Mine Robotics, and Siemens Programming. Experienced in implementing robotic systems, looking to enhance knowledge and skills to fit in the modernizing world.",
    "email": "thepushpaco@outlook.com",
    "phone": "+358 408795424",
    "location": "Helsinki, Finland",
    "linkedin": "https://linkedin.com/in/pushpa-koirala",
    "github": "https://github.com/pushpakoirala"
}

SKILLS_DATA = [
    {"name": "PLC Programming", "category": "Automation", "order": 1},
    {"name": "Siemens TIA Portal", "category": "Automation", "order": 2},
    {"name": "Valmet DNA", "category": "Automation", "order": 3},
    {"name": "DCS Systems", "category": "Automation", "order": 4},
    {"name": "HMI Development", "category": "Automation", "order": 5},
    {"name": "Profibus DP", "category": "Automation", "order": 6},
    {"name": "Fieldbus Communication", "category": "Automation", "order": 7},
    
    {"name": "Neural Networks (CNN, RNN, LSTM)", "category": "AI & ML", "order": 1},
    {"name": "Transfer Learning", "category": "AI & ML", "order": 2},
    {"name": "Machine Vision", "category": "AI & ML", "order": 3},
    {"name": "NLP", "category": "AI & ML", "order": 4},
    {"name": "Prediction Models", "category": "AI & ML", "order": 5},
    
    {"name": "Python", "category": "Programming", "order": 1},
    {"name": "C Programming", "category": "Programming", "order": 2},
    {"name": "MATLAB/SIMULINK", "category": "Programming", "order": 3},
    
    {"name": "AutoCAD", "category": "Design Tools", "order": 1},
    {"name": "LTSpice", "category": "Design Tools", "order": 2},
    {"name": "VisualComponents", "category": "Design Tools", "order": 3},
    {"name": "PCB Design", "category": "Design Tools", "order": 4},
    
    {"name": "LabVIEW", "category": "Testing", "order": 1},
    {"name": "TestStand", "category": "Testing", "order": 2},
    {"name": "NI LabVIEW", "category": "Testing", "order": 3},
    {"name": "Power BI", "category": "Testing", "order": 4},
    
    {"name": "Collaborative Robots", "category": "Industry 4.0", "order": 1},
    {"name": "AGV Systems", "category": "Industry 4.0", "order": 2},
    {"name": "Machine Vision", "category": "Industry 4.0", "order": 3},
    {"name": "3D Printing", "category": "Industry 4.0", "order": 4},
]

EXPERIENCE_DATA = [
    {
        "title": "Technical Support",
        "company": "A3Z Electronic Store",
        "location": "Nepal",
        "period": "03/2023 – 08/2023",
        "responsibilities": [
            "Diagnostic Testing and Component Level Repairing",
            "BIOS Recovery & Update Thermal Management",
            "Data Recovery and Software Troubleshooting",
            "Motherboard Repair and PC/Phone Assembly",
            "Electronic Device Repair with Safety Procedures"
        ],
        "order": 1
    },
    {
        "title": "Embedded System Support Engineer",
        "company": "SupaNirman Engineering & Construction PVT LTD.",
        "location": "Remote",
        "period": "03/2023 – 08/2023",
        "responsibilities": [
            "PCB Design & Firmware Development",
            "Prototype Development and Testing",
            "3D Printer Firmware Setup",
            "Industrial Liquid-Filling Machines Manufacturing",
            "Machine Installation and Supervision"
        ],
        "order": 2
    },
    {
        "title": "Service Technician Assistance",
        "company": "Vianet Communication",
        "location": "Nepal",
        "period": "12/2021 – 02/2023",
        "responsibilities": [
            "Optical Fiber Line Installation for Enhanced Connectivity",
            "Routine Maintenance on Optical Fiber Systems",
            "Fiber Optic Cable Cutting and Splicing",
            "OTDR Device Usage for Diagnostics",
            "Network Repairs and Device Troubleshooting"
        ],
        "order": 3
    }
]

EDUCATION_DATA = [
    {
        "degree": "Automation & Electrical Engineering",
        "institution": "JAMK University of Applied Science",
        "field_of_study": "Automation & Electrical Engineering",
        "location": "Jyväskylä, Finland",
        "period": "08/2024 – Present",
        "description": "Comprehensive studies in automation systems, PLC programming, robotics, AI, and control systems. Completed practical training in Siemens Programming, Valmet DNA, DCS Systems, and HMI Programming.",
        "highlights": [
            "Siemens TIA Portal Programming",
            "MATLAB/SIMULINK Modeling & Simulation",
            "Neural Networks & Machine Learning",
            "AutoCAD & Electrical Documentation",
            "LabVIEW & PC-based Measurement Applications"
        ],
        "order": 1
    }
]

CERTIFICATIONS_DATA = [
    {"name": "Oracle Autonomous Database Cloud 2025 Certified Professional", "order": 1},
    {"name": "Electrical Safety Training SF6000", "order": 2},
    {"name": "Occupational Safety Card", "order": 3},
    {"name": "Emergency First Aid Training", "order": 4},
    {"name": "Python Programming", "order": 5},
    {"name": "AI & Cybersecurity", "order": 6},
    {"name": "Mine Robotics", "order": 7},
    {"name": "Invent For The Planet", "order": 8}
]

PROJECTS_DATA = [
    {
        "title": "Industrial Automation System",
        "problem_statement": "Need for efficient PLC-based automation in manufacturing",
        "description": "Designed and implemented PLC-based automation system for manufacturing processes using Siemens TIA Portal.",
        "technologies": ["Siemens TIA Portal", "PLC", "HMI", "Profibus"],
        "role": "Automation Engineer",
        "outcome": "Improved manufacturing efficiency by 30%",
        "image_url": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
        "status": "Completed",
        "visible": True,
        "order": 1
    },
    {
        "title": "AI-Powered Machine Vision",
        "problem_statement": "Quality control challenges in production line",
        "description": "Developed machine vision system using CNN for quality control in production line.",
        "technologies": ["Python", "TensorFlow", "OpenCV", "CNN"],
        "role": "AI Engineer",
        "outcome": "Reduced defect rate by 40%",
        "image_url": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
        "status": "In Progress",
        "visible": True,
        "order": 2
    },
    {
        "title": "IoT Monitoring Dashboard",
        "problem_statement": "Need for real-time industrial IoT monitoring",
        "description": "Created real-time monitoring dashboard for industrial IoT devices with data visualization.",
        "technologies": ["Python", "Power BI", "IoT", "Data Networks"],
        "role": "IoT Developer",
        "outcome": "Real-time monitoring of 50+ devices",
        "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        "status": "Completed",
        "visible": True,
        "order": 3
    },
    {
        "title": "Embedded System Prototype",
        "problem_statement": "Custom embedded solution requirement",
        "description": "Designed PCB and developed firmware for custom embedded system application.",
        "technologies": ["PCB Design", "Firmware", "C Programming", "3D Printing"],
        "role": "Embedded Engineer",
        "outcome": "Functional prototype delivered",
        "image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
        "status": "Completed",
        "visible": True,
        "order": 4
    }
]

async def init_database():
    """Initialize database with CV data and admin user"""
    mongo_url = os.environ['MONGO_URL']
    db_name = os.environ.get('DB_NAME', 'portfolio_db')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("🚀 Initializing database...")
    
    # 1. Create admin user
    admin_exists = await db.admins.find_one({"username": "admin"})
    if not admin_exists:
        admin_user = {
            "username": "admin",
            "email": "thepushpaco@outlook.com",
            "password_hash": hash_password("Admin@2025")  # Secure password
        }
        await db.admins.insert_one(admin_user)
        print("✅ Admin user created (username: admin, password: Admin@2025)")
    else:
        print("ℹ️  Admin user already exists")
    
    # 2. Insert profile
    profile_exists = await db.profile.find_one()
    if not profile_exists:
        await db.profile.insert_one(PROFILE_DATA)
        print("✅ Profile data inserted")
    else:
        print("ℹ️  Profile already exists")
    
    # 3. Insert skills
    skills_count = await db.skills.count_documents({})
    if skills_count == 0:
        await db.skills.insert_many(SKILLS_DATA)
        print(f"✅ {len(SKILLS_DATA)} skills inserted")
    else:
        print(f"ℹ️  {skills_count} skills already exist")
    
    # 4. Insert experience
    exp_count = await db.experience.count_documents({})
    if exp_count == 0:
        await db.experience.insert_many(EXPERIENCE_DATA)
        print(f"✅ {len(EXPERIENCE_DATA)} experiences inserted")
    else:
        print(f"ℹ️  {exp_count} experiences already exist")
    
    # 5. Insert education
    edu_count = await db.education.count_documents({})
    if edu_count == 0:
        await db.education.insert_many(EDUCATION_DATA)
        print(f"✅ {len(EDUCATION_DATA)} education entries inserted")
    else:
        print(f"ℹ️  {edu_count} education entries already exist")
    
    # 6. Insert certifications
    cert_count = await db.certifications.count_documents({})
    if cert_count == 0:
        await db.certifications.insert_many(CERTIFICATIONS_DATA)
        print(f"✅ {len(CERTIFICATIONS_DATA)} certifications inserted")
    else:
        print(f"ℹ️  {cert_count} certifications already exist")
    
    # 7. Insert projects
    proj_count = await db.projects.count_documents({})
    if proj_count == 0:
        await db.projects.insert_many(PROJECTS_DATA)
        print(f"✅ {len(PROJECTS_DATA)} projects inserted")
    else:
        print(f"ℹ️  {proj_count} projects already exist")
    
    print("\n✨ Database initialization complete!")
    print("\n📝 Admin Credentials:")
    print("   Username: admin")
    print("   Password: Admin@2025")
    print("   ⚠️  Please change this password after first login!\n")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(init_database())
