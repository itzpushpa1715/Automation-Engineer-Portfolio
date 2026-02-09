import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Plus, Edit2, Trash2, Save, X, Eye, EyeOff, 
  User, Lock, Mail, Menu, Home, Settings, BookOpen,
  Briefcase, Award, MessageSquare, FolderOpen, Wrench,
  ExternalLink, Github, GraduationCap, ChevronDown
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
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
  authAPI,
} from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout, setUser } = useAuth();
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [skillForm, setSkillForm] = useState({ name: '', category: '', order: 0 });
  
  const [editingProject, setEditingProject] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', technologies: [], problem_statement: '',
    role: '', outcome: '', status: 'Completed', visible: true, 
    project_url: '', github_url: '', image_url: ''
  });
  
  const [editingExperience, setEditingExperience] = useState(null);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [experienceForm, setExperienceForm] = useState({
    title: '', company: '', location: '', period: '', responsibilities: []
  });

  const [editingEducation, setEditingEducation] = useState(null);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [educationForm, setEducationForm] = useState({
    degree: '', institution: '', field_of_study: '', location: '', 
    period: '', description: '', highlights: []
  });

  const [editingCertification, setEditingCertification] = useState(null);
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  const [certificationForm, setCertificationForm] = useState({
    name: '', issuing_organization: '', year: '', certificate_url: ''
  });

  // Settings states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [usernameForm, setUsernameForm] = useState({ new_username: '', current_password: '' });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

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
      resetSkillForm();
      toast({ title: "Success", description: "Skill saved!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save skill", variant: "destructive" });
    }
  };

  const resetSkillForm = () => {
    setEditingSkill(null);
    setShowSkillForm(false);
    setSkillForm({ name: '', category: '', order: 0 });
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
      const formData = {
        ...projectForm,
        technologies: Array.isArray(projectForm.technologies) 
          ? projectForm.technologies 
          : projectForm.technologies.split(',').map(t => t.trim()).filter(t => t)
      };
      
      if (editingProject) {
        await projectsAPI.update(editingProject, formData);
      } else {
        await projectsAPI.create(formData);
      }
      fetchAllData();
      resetProjectForm();
      toast({ title: "Success", description: "Project saved!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save project", variant: "destructive" });
    }
  };

  const resetProjectForm = () => {
    setEditingProject(null);
    setShowProjectForm(false);
    setProjectForm({
      title: '', description: '', technologies: [], problem_statement: '',
      role: '', outcome: '', status: 'Completed', visible: true,
      project_url: '', github_url: '', image_url: ''
    });
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
      const formData = {
        ...experienceForm,
        responsibilities: Array.isArray(experienceForm.responsibilities)
          ? experienceForm.responsibilities
          : experienceForm.responsibilities.split('\n').filter(r => r.trim())
      };
      
      if (editingExperience) {
        await experienceAPI.update(editingExperience, formData);
      } else {
        await experienceAPI.create(formData);
      }
      fetchAllData();
      resetExperienceForm();
      toast({ title: "Success", description: "Experience saved!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save experience", variant: "destructive" });
    }
  };

  const resetExperienceForm = () => {
    setEditingExperience(null);
    setShowExperienceForm(false);
    setExperienceForm({ title: '', company: '', location: '', period: '', responsibilities: [] });
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

  // Education handlers
  const handleSaveEducation = async () => {
    try {
      const formData = {
        ...educationForm,
        highlights: Array.isArray(educationForm.highlights)
          ? educationForm.highlights
          : educationForm.highlights.split('\n').filter(h => h.trim())
      };
      
      if (editingEducation) {
        await educationAPI.update(editingEducation, formData);
      } else {
        await educationAPI.create(formData);
      }
      fetchAllData();
      resetEducationForm();
      toast({ title: "Success", description: "Education saved!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save education", variant: "destructive" });
    }
  };

  const resetEducationForm = () => {
    setEditingEducation(null);
    setShowEducationForm(false);
    setEducationForm({
      degree: '', institution: '', field_of_study: '', location: '', 
      period: '', description: '', highlights: []
    });
  };

  const handleDeleteEducation = async (id) => {
    if (window.confirm('Delete this education?')) {
      try {
        await educationAPI.delete(id);
        fetchAllData();
        toast({ title: "Success", description: "Education deleted!" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete education", variant: "destructive" });
      }
    }
  };

  // Certification handlers
  const handleSaveCertification = async () => {
    try {
      if (editingCertification) {
        await certificationsAPI.update(editingCertification, certificationForm);
      } else {
        await certificationsAPI.create(certificationForm);
      }
      fetchAllData();
      resetCertificationForm();
      toast({ title: "Success", description: "Certification saved!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save certification", variant: "destructive" });
    }
  };

  const resetCertificationForm = () => {
    setEditingCertification(null);
    setShowCertificationForm(false);
    setCertificationForm({ name: '', issuing_organization: '', year: '', certificate_url: '' });
  };

  const handleDeleteCertification = async (id) => {
    if (window.confirm('Delete this certification?')) {
      try {
        await certificationsAPI.delete(id);
        fetchAllData();
        toast({ title: "Success", description: "Certification deleted!" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete certification", variant: "destructive" });
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

  // Password change handler
  const handleChangePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast({ title: "Error", description: "Passwords don't match", variant: "destructive" });
      return;
    }
    try {
      await authAPI.changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      setShowPasswordForm(false);
      toast({ title: "Success", description: "Password changed successfully!" });
    } catch (error) {
      toast({ title: "Error", description: error.response?.data?.detail || "Failed to change password", variant: "destructive" });
    }
  };

  // Username change handler
  const handleChangeUsername = async () => {
    try {
      const response = await authAPI.updateUsername({
        new_username: usernameForm.new_username,
        current_password: usernameForm.current_password
      });
      localStorage.setItem('adminToken', response.data.token);
      setUser({ ...user, username: usernameForm.new_username });
      setUsernameForm({ new_username: '', current_password: '' });
      setShowUsernameForm(false);
      toast({ title: "Success", description: "Username changed successfully!" });
    } catch (error) {
      toast({ title: "Error", description: error.response?.data?.detail || "Failed to change username", variant: "destructive" });
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20" data-testid="login-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Admin Login</CardTitle>
            <CardDescription className="text-gray-300">Enter credentials to access dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                placeholder="Username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                data-testid="login-username"
              />
              <Input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                data-testid="login-password"
              />
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" data-testid="login-submit">
                Login
              </Button>
              <Button type="button" variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2" data-testid="mobile-menu-btn">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Admin Panel</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout} data-testid="mobile-logout-btn">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-slate-900 z-50 transform transition-transform duration-300
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <h1 className="text-xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-sm text-gray-400">{user?.username}</p>
        </div>
        
        <nav className="px-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === tab.id 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-white/10'
              }`}
              data-testid={`nav-${tab.id}`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
              {tab.id === 'messages' && messages.filter(m => m.status === 'unread').length > 0 && (
                <Badge className="ml-auto bg-red-500 text-white">
                  {messages.filter(m => m.status === 'unread').length}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Button 
            variant="outline" 
            className="w-full border-white/20 text-white hover:bg-white/10 mb-2"
            onClick={() => navigate('/')}
          >
            <Home className="w-4 h-4 mr-2" />
            View Site
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={handleLogout}
            data-testid="logout-btn"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8 max-w-6xl mx-auto">
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Profile Information</h2>
                  <p className="text-gray-600">Manage your public profile</p>
                </div>
                {!editingProfile ? (
                  <Button onClick={() => setEditingProfile(true)} data-testid="edit-profile-btn">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateProfile} data-testid="save-profile-btn">
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

              <Card>
                <CardContent className="pt-6">
                  {editingProfile ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                        <Input
                          value={profileForm.linkedin || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">GitHub URL</label>
                        <Input
                          value={profileForm.github || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Headline</label>
                        <Input
                          value={profileForm.headline || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">About Me</label>
                        <Textarea
                          rows={5}
                          value={profileForm.about || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, about: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><span className="text-gray-500">Name:</span> <span className="font-medium">{profile?.name}</span></div>
                      <div><span className="text-gray-500">Title:</span> <span className="font-medium">{profile?.title}</span></div>
                      <div><span className="text-gray-500">Email:</span> <span className="font-medium">{profile?.email}</span></div>
                      <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{profile?.phone}</span></div>
                      <div><span className="text-gray-500">Location:</span> <span className="font-medium">{profile?.location}</span></div>
                      <div className="md:col-span-2"><span className="text-gray-500">About:</span> <span className="font-medium">{profile?.about}</span></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
                  <p className="text-gray-600">Manage your portfolio projects</p>
                </div>
                <Button onClick={() => { resetProjectForm(); setShowProjectForm(true); }} data-testid="add-project-btn">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </div>

              {showProjectForm && (
                <Card className="border-purple-200 bg-purple-50/50">
                  <CardHeader>
                    <CardTitle>{editingProject ? 'Edit Project' : 'New Project'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Title *</label>
                        <Input
                          placeholder="Project title"
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          data-testid="project-title-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={projectForm.status}
                          onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                        >
                          <option value="Completed">Completed</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Planned">Planned</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description *</label>
                      <Textarea
                        placeholder="Project description"
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        data-testid="project-description-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Technologies (comma separated)</label>
                      <Input
                        placeholder="React, Node.js, MongoDB"
                        value={Array.isArray(projectForm.technologies) ? projectForm.technologies.join(', ') : projectForm.technologies}
                        onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Project URL</label>
                        <Input
                          placeholder="https://example.com"
                          value={projectForm.project_url}
                          onChange={(e) => setProjectForm({ ...projectForm, project_url: e.target.value })}
                          data-testid="project-url-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">GitHub URL</label>
                        <Input
                          placeholder="https://github.com/..."
                          value={projectForm.github_url}
                          onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                          data-testid="project-github-input"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Image URL</label>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        value={projectForm.image_url}
                        onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                        data-testid="project-image-input"
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSaveProject} data-testid="save-project-btn">
                        <Save className="w-4 h-4 mr-2" />
                        Save Project
                      </Button>
                      <Button variant="outline" onClick={resetProjectForm}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="overflow-hidden" data-testid={`project-card-${project.id}`}>
                    {project.image_url && (
                      <div className="h-40 bg-gray-100">
                        <img 
                          src={project.image_url} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{project.title}</h3>
                        <Badge variant={project.visible ? "default" : "secondary"}>
                          {project.visible ? 'Visible' : 'Hidden'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.technologies?.slice(0, 3).map((tech, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{tech}</Badge>
                        ))}
                      </div>
                      {(project.project_url || project.github_url) && (
                        <div className="flex gap-2 mb-3">
                          {project.project_url && (
                            <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:underline flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" /> Live
                            </a>
                          )}
                          {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:underline flex items-center gap-1">
                              <Github className="w-3 h-3" /> Code
                            </a>
                          )}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleToggleProjectVisibility(project.id, project.visible)}
                        >
                          {project.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setEditingProject(project.id);
                            setProjectForm({
                              ...project,
                              technologies: project.technologies || []
                            });
                            setShowProjectForm(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Skills</h2>
                  <p className="text-gray-600">Manage your technical skills</p>
                </div>
                <Button onClick={() => { resetSkillForm(); setShowSkillForm(true); }} data-testid="add-skill-btn">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>

              {showSkillForm && (
                <Card className="border-purple-200 bg-purple-50/50">
                  <CardHeader>
                    <CardTitle>{editingSkill ? 'Edit Skill' : 'New Skill'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Skill Name *</label>
                        <Input
                          placeholder="e.g., Python"
                          value={skillForm.name}
                          onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                          data-testid="skill-name-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Category *</label>
                        <Input
                          placeholder="e.g., Programming"
                          value={skillForm.category}
                          onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                          data-testid="skill-category-input"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveSkill} data-testid="save-skill-btn">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={resetSkillForm}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {skills.map((skill) => (
                  <Card key={skill.id} className="p-4" data-testid={`skill-card-${skill.id}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{skill.name}</p>
                        <p className="text-sm text-gray-500">{skill.category}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            setEditingSkill(skill.id);
                            setSkillForm(skill);
                            setShowSkillForm(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteSkill(skill.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Experience</h2>
                  <p className="text-gray-600">Manage your work experience</p>
                </div>
                <Button onClick={() => { resetExperienceForm(); setShowExperienceForm(true); }} data-testid="add-experience-btn">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>

              {showExperienceForm && (
                <Card className="border-purple-200 bg-purple-50/50">
                  <CardHeader>
                    <CardTitle>{editingExperience ? 'Edit Experience' : 'New Experience'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Job Title *</label>
                        <Input
                          placeholder="e.g., Software Engineer"
                          value={experienceForm.title}
                          onChange={(e) => setExperienceForm({ ...experienceForm, title: e.target.value })}
                          data-testid="experience-title-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Company *</label>
                        <Input
                          placeholder="e.g., Google"
                          value={experienceForm.company}
                          onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                          data-testid="experience-company-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Location</label>
                        <Input
                          placeholder="e.g., San Francisco, CA"
                          value={experienceForm.location}
                          onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Period</label>
                        <Input
                          placeholder="e.g., 01/2023 - Present"
                          value={experienceForm.period}
                          onChange={(e) => setExperienceForm({ ...experienceForm, period: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Responsibilities (one per line)</label>
                      <Textarea
                        rows={4}
                        placeholder="Enter each responsibility on a new line"
                        value={Array.isArray(experienceForm.responsibilities) ? experienceForm.responsibilities.join('\n') : experienceForm.responsibilities}
                        onChange={(e) => setExperienceForm({ ...experienceForm, responsibilities: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveExperience} data-testid="save-experience-btn">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={resetExperienceForm}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {experiences.map((exp) => (
                  <Card key={exp.id} data-testid={`experience-card-${exp.id}`}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{exp.title}</h3>
                          <p className="text-purple-600">{exp.company}</p>
                          <p className="text-sm text-gray-500">{exp.location} • {exp.period}</p>
                          {exp.responsibilities?.length > 0 && (
                            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                              {exp.responsibilities.slice(0, 3).map((r, i) => (
                                <li key={i}>{r}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setEditingExperience(exp.id);
                              setExperienceForm(exp);
                              setShowExperienceForm(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteExperience(exp.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Education</h2>
                  <p className="text-gray-600">Manage your educational background</p>
                </div>
                <Button onClick={() => { resetEducationForm(); setShowEducationForm(true); }} data-testid="add-education-btn">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </div>

              {showEducationForm && (
                <Card className="border-purple-200 bg-purple-50/50">
                  <CardHeader>
                    <CardTitle>{editingEducation ? 'Edit Education' : 'New Education'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Degree *</label>
                        <Input
                          placeholder="e.g., Bachelor of Science"
                          value={educationForm.degree}
                          onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                          data-testid="education-degree-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Institution *</label>
                        <Input
                          placeholder="e.g., MIT"
                          value={educationForm.institution}
                          onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                          data-testid="education-institution-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Field of Study</label>
                        <Input
                          placeholder="e.g., Computer Science"
                          value={educationForm.field_of_study}
                          onChange={(e) => setEducationForm({ ...educationForm, field_of_study: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Location</label>
                        <Input
                          placeholder="e.g., Cambridge, MA"
                          value={educationForm.location}
                          onChange={(e) => setEducationForm({ ...educationForm, location: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Period</label>
                        <Input
                          placeholder="e.g., 2019 - 2023"
                          value={educationForm.period}
                          onChange={(e) => setEducationForm({ ...educationForm, period: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        rows={3}
                        placeholder="Brief description of your education"
                        value={educationForm.description}
                        onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Highlights (one per line)</label>
                      <Textarea
                        rows={3}
                        placeholder="Key achievements, courses, or activities"
                        value={Array.isArray(educationForm.highlights) ? educationForm.highlights.join('\n') : educationForm.highlights}
                        onChange={(e) => setEducationForm({ ...educationForm, highlights: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveEducation} data-testid="save-education-btn">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={resetEducationForm}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {education.map((edu) => (
                  <Card key={edu.id} data-testid={`education-card-${edu.id}`}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{edu.degree}</h3>
                          <p className="text-purple-600">{edu.institution}</p>
                          {edu.field_of_study && <p className="text-sm text-gray-600">{edu.field_of_study}</p>}
                          <p className="text-sm text-gray-500">{edu.location} • {edu.period}</p>
                          {edu.description && <p className="mt-2 text-sm text-gray-600">{edu.description}</p>}
                          {edu.highlights?.length > 0 && (
                            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                              {edu.highlights.slice(0, 3).map((h, i) => (
                                <li key={i}>{h}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setEditingEducation(edu.id);
                              setEducationForm(edu);
                              setShowEducationForm(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteEducation(edu.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Certifications</h2>
                  <p className="text-gray-600">Manage your certifications</p>
                </div>
                <Button onClick={() => { resetCertificationForm(); setShowCertificationForm(true); }} data-testid="add-certification-btn">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certification
                </Button>
              </div>

              {showCertificationForm && (
                <Card className="border-purple-200 bg-purple-50/50">
                  <CardHeader>
                    <CardTitle>{editingCertification ? 'Edit Certification' : 'New Certification'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Certification Name *</label>
                        <Input
                          placeholder="e.g., AWS Solutions Architect"
                          value={certificationForm.name}
                          onChange={(e) => setCertificationForm({ ...certificationForm, name: e.target.value })}
                          data-testid="certification-name-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Issuing Organization *</label>
                        <Input
                          placeholder="e.g., Amazon Web Services"
                          value={certificationForm.issuing_organization}
                          onChange={(e) => setCertificationForm({ ...certificationForm, issuing_organization: e.target.value })}
                          data-testid="certification-org-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Year</label>
                        <Input
                          placeholder="e.g., 2024"
                          value={certificationForm.year}
                          onChange={(e) => setCertificationForm({ ...certificationForm, year: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Certificate URL</label>
                        <Input
                          placeholder="https://..."
                          value={certificationForm.certificate_url}
                          onChange={(e) => setCertificationForm({ ...certificationForm, certificate_url: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveCertification} data-testid="save-certification-btn">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={resetCertificationForm}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {certifications.map((cert) => (
                  <Card key={cert.id} data-testid={`certification-card-${cert.id}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <Award className="w-8 h-8 text-purple-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold truncate">{cert.name}</h3>
                          <p className="text-sm text-gray-600">{cert.issuing_organization}</p>
                          <p className="text-sm text-gray-500">{cert.year}</p>
                          {cert.certificate_url && (
                            <a 
                              href={cert.certificate_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-purple-600 hover:underline flex items-center gap-1 mt-1"
                            >
                              <ExternalLink className="w-3 h-3" /> View Certificate
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setEditingCertification(cert.id);
                            setCertificationForm(cert);
                            setShowCertificationForm(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleDeleteCertification(cert.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Messages</h2>
                <p className="text-gray-600">{messages.length} message(s) received</p>
              </div>

              {messages.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No messages yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <Card 
                      key={msg.id} 
                      className={msg.status === 'unread' ? 'border-l-4 border-l-purple-600' : ''}
                      data-testid={`message-card-${msg.id}`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold">{msg.name}</h3>
                              {msg.status === 'unread' && (
                                <Badge className="bg-purple-600">New</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{msg.email}</p>
                            <p className="mt-3 text-gray-700">{msg.message}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(msg.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleToggleMessageRead(msg.id, msg.status)}
                            >
                              {msg.status === 'read' ? 'Mark Unread' : 'Mark Read'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeleteMessage(msg.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Account Settings</h2>
                <p className="text-gray-600">Manage your admin account</p>
              </div>

              {/* Change Username */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Change Username
                  </CardTitle>
                  <CardDescription>Update your admin username</CardDescription>
                </CardHeader>
                <CardContent>
                  {!showUsernameForm ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Current username</p>
                        <p className="font-medium">{user?.username}</p>
                      </div>
                      <Button onClick={() => setShowUsernameForm(true)} data-testid="change-username-btn">
                        Change Username
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">New Username</label>
                        <Input
                          placeholder="Enter new username"
                          value={usernameForm.new_username}
                          onChange={(e) => setUsernameForm({ ...usernameForm, new_username: e.target.value })}
                          data-testid="new-username-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Current Password (for verification)</label>
                        <Input
                          type="password"
                          placeholder="Enter current password"
                          value={usernameForm.current_password}
                          onChange={(e) => setUsernameForm({ ...usernameForm, current_password: e.target.value })}
                          data-testid="username-password-input"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleChangeUsername} data-testid="save-username-btn">
                          <Save className="w-4 h-4 mr-2" />
                          Save Username
                        </Button>
                        <Button variant="outline" onClick={() => {
                          setShowUsernameForm(false);
                          setUsernameForm({ new_username: '', current_password: '' });
                        }}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Change Password
                  </CardTitle>
                  <CardDescription>Update your admin password</CardDescription>
                </CardHeader>
                <CardContent>
                  {!showPasswordForm ? (
                    <Button onClick={() => setShowPasswordForm(true)} data-testid="change-password-btn">
                      Change Password
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Current Password</label>
                        <Input
                          type="password"
                          placeholder="Enter current password"
                          value={passwordForm.current_password}
                          onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                          data-testid="current-password-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">New Password</label>
                        <Input
                          type="password"
                          placeholder="Enter new password"
                          value={passwordForm.new_password}
                          onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                          data-testid="new-password-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                          value={passwordForm.confirm_password}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                          data-testid="confirm-password-input"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleChangePassword} data-testid="save-password-btn">
                          <Save className="w-4 h-4 mr-2" />
                          Update Password
                        </Button>
                        <Button variant="outline" onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
                        }}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
