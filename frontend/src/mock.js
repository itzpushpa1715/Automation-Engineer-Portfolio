// Mock data from Pushpa Koirala's CV

export const personalInfo = {
  name: "Pushpa Koirala",
  title: "Automation & Electrical Engineer",
  email: "thepushpaco@outlook.com",
  phone: "+358 408795424",
  location: "Helsinki, Finland",
  linkedin: "https://linkedin.com/in/pushpa-koirala",
  github: "https://github.com/pushpakoirala",
  summary: "Automation & Electrical Engineering student with a strong background in Electronics & Artificial Intelligence, Cybersecurity, Mine Robotics, and Siemens Programming. Experienced in implementing robotic systems, looking to enhance knowledge and skills to fit in the modernizing world."
};

export const skills = {
  programmingLanguages: ["Python", "C Programming", "MATLAB/SIMULINK"],
  automation: [
    "PLC Programming",
    "Siemens TIA Portal",
    "Valmet DNA",
    "DCS Systems",
    "HMI Development",
    "Profibus DP",
    "Fieldbus Communication"
  ],
  aiMachineLearning: [
    "Neural Networks (CNN, RNN, LSTM)",
    "Transfer Learning",
    "Machine Vision",
    "NLP",
    "Prediction Models"
  ],
  designTools: [
    "AutoCAD",
    "LTSpice",
    "VisualComponents",
    "PCB Design"
  ],
  testing: ["LabVIEW", "TestStand", "NI LabVIEW", "Power BI"],
  industry40: [
    "Collaborative Robots",
    "AGV Systems",
    "Machine Vision",
    "3D Printing"
  ],
  softSkills: [
    "Analytical Thinking",
    "Problem Solving",
    "Safety Procedures",
    "Team Collaboration"
  ]
};

export const experience = [
  {
    id: 1,
    title: "Technical Support",
    company: "A3Z Electronic Store",
    location: "Nepal",
    period: "03/2023 – 08/2023",
    responsibilities: [
      "Diagnostic Testing and Component Level Repairing",
      "BIOS Recovery & Update Thermal Management",
      "Data Recovery and Software Troubleshooting",
      "Motherboard Repair and PC/Phone Assembly",
      "Electronic Device Repair with Safety Procedures"
    ]
  },
  {
    id: 2,
    title: "Embedded System Support Engineer",
    company: "SupaNirman Engineering & Construction PVT LTD.",
    location: "Remote",
    period: "03/2023 – 08/2023",
    responsibilities: [
      "PCB Design & Firmware Development",
      "Prototype Development and Testing",
      "3D Printer Firmware Setup",
      "Industrial Liquid-Filling Machines Manufacturing",
      "Machine Installation and Supervision"
    ]
  },
  {
    id: 3,
    title: "Service Technician Assistance",
    company: "Vianet Communication",
    location: "Nepal",
    period: "12/2021 – 02/2023",
    responsibilities: [
      "Optical Fiber Line Installation for Enhanced Connectivity",
      "Routine Maintenance on Optical Fiber Systems",
      "Fiber Optic Cable Cutting and Splicing",
      "OTDR Device Usage for Diagnostics",
      "Network Repairs and Device Troubleshooting"
    ]
  }
];

export const education = [
  {
    id: 1,
    degree: "Automation & Electrical Engineering",
    institution: "JAMK University of Applied Science",
    location: "Jyväskylä, Finland",
    period: "08/2024 – Present",
    description: "Comprehensive studies in automation systems, PLC programming, robotics, AI, and control systems. Completed practical training in Siemens Programming, Valmet DNA, DCS Systems, and HMI Programming.",
    highlights: [
      "Siemens TIA Portal Programming",
      "MATLAB/SIMULINK Modeling & Simulation",
      "Neural Networks & Machine Learning",
      "AutoCAD & Electrical Documentation",
      "LabVIEW & PC-based Measurement Applications"
    ]
  }
];

export const certifications = [
  { id: 1, name: "Oracle Autonomous Database Cloud 2025 Certified Professional" },
  { id: 2, name: "Electrical Safety Training SF6000" },
  { id: 3, name: "Occupational Safety Card" },
  { id: 4, name: "Emergency First Aid Training" },
  { id: 5, name: "Python Programming" },
  { id: 6, name: "AI & Cybersecurity" },
  { id: 7, name: "Mine Robotics" },
  { id: 8, name: "Invent For The Planet" }
];

export const projects = [
  {
    id: 1,
    title: "Industrial Automation System",
    description: "Designed and implemented PLC-based automation system for manufacturing processes using Siemens TIA Portal.",
    technologies: ["Siemens TIA Portal", "PLC", "HMI", "Profibus"],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
    status: "Completed"
  },
  {
    id: 2,
    title: "AI-Powered Machine Vision",
    description: "Developed machine vision system using CNN for quality control in production line.",
    technologies: ["Python", "TensorFlow", "OpenCV", "CNN"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    status: "In Progress"
  },
  {
    id: 3,
    title: "IoT Monitoring Dashboard",
    description: "Created real-time monitoring dashboard for industrial IoT devices with data visualization.",
    technologies: ["Python", "Power BI", "IoT", "Data Networks"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    status: "Completed"
  },
  {
    id: 4,
    title: "Embedded System Prototype",
    description: "Designed PCB and developed firmware for custom embedded system application.",
    technologies: ["PCB Design", "Firmware", "C Programming", "3D Printing"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    status: "Completed"
  }
];

export const contactMessages = [];

// Mock admin credentials (for frontend only)
export const adminCredentials = {
  username: "admin",
  password: "admin123"
};
