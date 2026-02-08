import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Edit2, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { toast } from '../hooks/use-toast';
import { useAuth } from '../context/AuthContext';
import {
  profileAPI,
  skillsAPI,
  projectsAPI,
  experienceAPI,
  educationAPI,
  certificationsAPI,
  messagesAPI,
} from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout } = useAuth();
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // States for all data
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [messages, setMessages] = useState([]);

  // Edit states
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({ name: '', category: '', order: 0 });
  
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', technologies: [], problem_statement: '',
    role: '', outcome: '', status: 'Completed', visible: true
  });
  
  const [editingExperience, setEditingExperience] = useState(null);
  const [experienceForm, setExperienceForm] = useState({
    title: '', company: '', location: '', period: '', responsibilities: []
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const fetchAllData = async () => {
    try {
      const [profileRes, skillsRes, projectsRes, expRes, eduRes, certRes, msgRes] = await Promise.all([
        profileAPI.get(),
        skillsAPI.getAll(),
        projectsAPI.getAll(),
        experienceAPI.getAll(),
        educationAPI.getAll(),
        certificationsAPI.getAll(),
        messagesAPI.getAll(),
      ]);

      setProfile(profileRes.data);
      setProfileForm(profileRes.data);
      setSkills(skillsRes.data);
      setProjects(projectsRes.data);
      setExperiences(expRes.data);
      setEducation(eduRes.data);
      setCertifications(certRes.data);
      setMessages(msgRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(loginForm);
    if (result.success) {
      toast({ title: "Login Successful", description: "Welcome to admin dashboard!" });
    } else {
      toast({ title: "Login Failed", description: result.error, variant: "destructive" });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Profile handlers
  const handleUpdateProfile = async () => {
    try {
      await profileAPI.update(profileForm);
      setProfile(profileForm);
      setEditingProfile(false);
      toast({ title: "Success", description: "Profile updated!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    }
  };

  // Skill handlers
  const handleSaveSkill = async () => {
    try {
      if (editingSkill) {
        await skillsAPI.update(editingSkill, skillForm);
      } else {
        await skillsAPI.create(skillForm);
      }
      fetchAllData();
      setEditingSkill(null);
      setSkillForm({ name: '', category: '', order: 0 });
      toast({ title: "Success", description: "Skill saved!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save skill", variant: "destructive" });
    }
  };

  const handleDeleteSkill = async (id) => {
    if (window.confirm('Delete this skill?')) {
      try {
        await skillsAPI.delete(id);
        fetchAllData();
        toast({ title: "Success", description: "Skill deleted!" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete skill", variant: "destructive" });
      }
    }
  };

  // Project handlers
  const handleSaveProject = async () => {
    try {
      if (editingProject) {
        await projectsAPI.update(editingProject, projectForm);
      } else {
        await projectsAPI.create(projectForm);
      }
      fetchAllData();
      setEditingProject(null);
      setProjectForm({
        title: '', description: '', technologies: [], problem_statement: '',
        role: '', outcome: '', status: 'Completed', visible: true
      });
      toast({ title: "Success", description: "Project saved!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save project", variant: "destructive" });
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await projectsAPI.delete(id);
        fetchAllData();
        toast({ title: "Success", description: "Project deleted!" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete project", variant: "destructive" });
      }
    }
  };

  const handleToggleProjectVisibility = async (id, visible) => {
    try {
      await projectsAPI.toggleVisibility(id, !visible);
      fetchAllData();
      toast({ title: "Success", description: "Visibility updated!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update visibility", variant: "destructive" });
    }
  };

  // Experience handlers
  const handleSaveExperience = async () => {
    try {
      if (editingExperience) {
        await experienceAPI.update(editingExperience, experienceForm);
      } else {
        await experienceAPI.create(experienceForm);
      }
      fetchAllData();
      setEditingExperience(null);
      setExperienceForm({ title: '', company: '', location: '', period: '', responsibilities: [] });
      toast({ title: "Success", description: "Experience saved!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save experience", variant: "destructive" });
    }
  };

  const handleDeleteExperience = async (id) => {
    if (window.confirm('Delete this experience?')) {
      try {
        await experienceAPI.delete(id);
        fetchAllData();
        toast({ title: "Success", description: "Experience deleted!" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete experience", variant: "destructive" });
      }
    }
  };

  // Message handlers
  const handleDeleteMessage = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        await messagesAPI.delete(id);
        fetchAllData();
        toast({ title: "Success", description: "Message deleted!" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete message", variant: "destructive" });
      }
    }
  };

  const handleToggleMessageRead = async (id, status) => {
    try {
      if (status === 'read') {
        await messagesAPI.markAsUnread(id);
      } else {
        await messagesAPI.markAsRead(id);
      }
      fetchAllData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update message", variant: "destructive" });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Enter credentials to access dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                placeholder="Username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Login
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                View Site
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </div>
                  {!editingProfile ? (
                    <Button onClick={() => setEditingProfile(true)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateProfile}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setEditingProfile(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingProfile ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <Input
                          value={profileForm.name || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <Input
                          value={profileForm.title || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input
                          type="email"
                          value={profileForm.email || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <Input
                          value={profileForm.phone || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Location</label>
                        <Input
                          value={profileForm.location || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">LinkedIn</label>
                        <Input
                          value={profileForm.linkedin || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">GitHub</label>
                        <Input
                          value={profileForm.github || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Headline</label>
                      <Input
                        value={profileForm.headline || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">About Me</label>
                      <Textarea
                        rows={5}
                        value={profileForm.about || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, about: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {profile?.name}</p>
                    <p><strong>Title:</strong> {profile?.title}</p>
                    <p><strong>Email:</strong> {profile?.email}</p>
                    <p><strong>Phone:</strong> {profile?.phone}</p>
                    <p><strong>Location:</strong> {profile?.location}</p>
                    <p><strong>About:</strong> {profile?.about}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab - CONTINUES IN NEXT FILE DUE TO LENGTH */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Manage Skills</CardTitle>
                    <CardDescription>Add, edit, or delete your skills</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingSkill(null);
                    setSkillForm({ name: '', category: '', order: 0 });
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(editingSkill !== null || skillForm.name) && (
                  <Card className="mb-6 p-4">
                    <div className="space-y-4">
                      <Input
                        placeholder="Skill Name"
                        value={skillForm.name}
                        onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                      />
                      <Input
                        placeholder="Category (e.g., Programming, Automation)"
                        value={skillForm.category}
                        onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleSaveSkill}>Save</Button>
                        <Button variant="outline" onClick={() => {
                          setEditingSkill(null);
                          setSkillForm({ name: '', category: '', order: 0 });
                        }}>Cancel</Button>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{skill.name}</p>
                        <p className="text-sm text-gray-600">{skill.category}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditingSkill(skill.id);
                          setSkillForm(skill);
                        }}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteSkill(skill.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Manage Projects</CardTitle>
                    <CardDescription>Add, edit, or delete projects</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingProject(null);
                    setProjectForm({
                      title: '', description: '', technologies: [], problem_statement: '',
                      role: '', outcome: '', status: 'Completed', visible: true
                    });
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(editingProject !== null || projectForm.title) && (
                  <Card className="mb-6 p-4">
                    <div className="space-y-4">
                      <Input
                        placeholder="Project Title"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      />
                      <Textarea
                        placeholder="Description"
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      />
                      <Input
                        placeholder="Technologies (comma separated)"
                        value={projectForm.technologies.join(', ')}
                        onChange={(e) => setProjectForm({ 
                          ...projectForm, 
                          technologies: e.target.value.split(',').map(t => t.trim())
                        })}
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleSaveProject}>Save</Button>
                        <Button variant="outline" onClick={() => {
                          setEditingProject(null);
                          setProjectForm({
                            title: '', description: '', technologies: [], problem_statement: '',
                            role: '', outcome: '', status: 'Completed', visible: true
                          });
                        }}>Cancel</Button>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="space-y-4">
                  {projects.map((project) => (
                    <Card key={project.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{project.title}</h3>
                            <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                            <div className="flex gap-2 mt-2">
                              {project.technologies.map((tech, i) => (
                                <Badge key={i} variant="secondary">{tech}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleToggleProjectVisibility(project.id, project.visible)}>
                              {project.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => {
                              setEditingProject(project.id);
                              setProjectForm(project);
                            }}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteProject(project.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Manage Experience</CardTitle>
                    <CardDescription>Add, edit, or delete work experience</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingExperience(null);
                    setExperienceForm({ title: '', company: '', location: '', period: '', responsibilities: [] });
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(editingExperience !== null || experienceForm.title) && (
                  <Card className="mb-6 p-4">
                    <div className="space-y-4">
                      <Input
                        placeholder="Job Title"
                        value={experienceForm.title}
                        onChange={(e) => setExperienceForm({ ...experienceForm, title: e.target.value })}
                      />
                      <Input
                        placeholder="Company"
                        value={experienceForm.company}
                        onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                      />
                      <Input
                        placeholder="Location"
                        value={experienceForm.location}
                        onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                      />
                      <Input
                        placeholder="Period (e.g., 01/2023 - 12/2023)"
                        value={experienceForm.period}
                        onChange={(e) => setExperienceForm({ ...experienceForm, period: e.target.value })}
                      />
                      <Textarea
                        placeholder="Responsibilities (one per line)"
                        value={experienceForm.responsibilities.join('\n')}
                        onChange={(e) => setExperienceForm({ 
                          ...experienceForm, 
                          responsibilities: e.target.value.split('\n')
                        })}
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleSaveExperience}>Save</Button>
                        <Button variant="outline" onClick={() => {
                          setEditingExperience(null);
                          setExperienceForm({ title: '', company: '', location: '', period: '', responsibilities: [] });
                        }}>Cancel</Button>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <Card key={exp.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">{exp.title}</h3>
                            <p className="text-sm text-gray-600">{exp.company} - {exp.location}</p>
                            <p className="text-sm text-gray-500">{exp.period}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => {
                              setEditingExperience(exp.id);
                              setExperienceForm(exp);
                            }}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteExperience(exp.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle>Education (Coming Soon)</CardTitle>
                <CardDescription>Full education management in next update</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {education.map((edu) => (
                    <Card key={edu.id}>
                      <CardContent className="pt-6">
                        <h3 className="font-bold">{edu.degree}</h3>
                        <p className="text-sm">{edu.institution}</p>
                        <p className="text-sm text-gray-600">{edu.period}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>{messages.length} message(s) received</CardDescription>
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No messages yet.</p>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <Card key={msg.id} className={msg.status === 'unread' ? 'border-blue-500' : ''}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{msg.name}</h3>
                              <p className="text-sm text-gray-600">{msg.email}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleToggleMessageRead(msg.id, msg.status)}>
                                {msg.status === 'read' ? 'Unread' : 'Read'}
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteMessage(msg.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-700 mt-3">{msg.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(msg.created_at).toLocaleString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
