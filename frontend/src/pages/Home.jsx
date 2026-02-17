import React, { useState, useEffect } from 'react';
import { Mail, Linkedin, Github, Send, ExternalLink, Menu, X, Zap, Cpu, CircuitBoard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { toast } from '../hooks/use-toast';
import { profileAPI, skillsAPI, projectsAPI, experienceAPI, educationAPI, certificationsAPI, messagesAPI } from '../services/api';

const Home = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [
        profileRes,
        skillsRes,
        projectsRes,
        experienceRes,
        educationRes,
        certificationsRes
      ] = await Promise.all([
        profileAPI.get(),
        skillsAPI.getAll(),
        projectsAPI.getAll(true),
        experienceAPI.getAll(),
        educationAPI.getAll(),
        certificationsAPI.getAll()
      ]);

      setProfile(profileRes.data);
      setSkills(skillsRes.data);
      setProjects(projectsRes.data);
      setExperience(experienceRes.data);
      setEducation(educationRes.data);
      setCertifications(certificationsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load portfolio data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill.name);
    return acc;
  }, {});

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'projects', 'skills', 'about-me', 'contacts'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await messagesAPI.create(formData);
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1f] via-[#16213e] to-[#0f3460] flex items-center justify-center">
        <div className="text-[#00d9ff] text-xl font-mono">INITIALIZING SYSTEM...</div>
      </div>
    );
  }

  const navItems = [
    { id: 'home', label: 'home' },
    { id: 'projects', label: 'works' },
    { id: 'skills', label: 'skills' },
    { id: 'about-me', label: 'about-me' },
    { id: 'contacts', label: 'contacts' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1f] via-[#16213e] to-[#0f3460] text-white grid-background" style={{ fontFamily: 'Fira Code, monospace' }}>
      {/* Fixed Left Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-16 hidden lg:flex flex-col items-center justify-between py-8 z-50 border-r border-[#00d9ff]/20">
        <div className="w-px h-32 bg-gradient-to-b from-[#00d9ff]/60 to-transparent"></div>
        <div className="flex flex-col gap-4">
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-[#00d9ff]/60 hover:text-[#00d9ff] transition-all duration-300 hover:drop-shadow-lg" data-testid="social-github">
              <Github className="w-6 h-6" />
            </a>
          )}
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#00d9ff]/60 hover:text-[#00d9ff] transition-all duration-300 hover:drop-shadow-lg" data-testid="social-linkedin">
              <Linkedin className="w-6 h-6" />
            </a>
          )}
          <a href={`mailto:${profile.email}`} className="text-[#00d9ff]/60 hover:text-[#00d9ff] transition-all duration-300 hover:drop-shadow-lg" data-testid="social-email">
            <Mail className="w-6 h-6" />
          </a>
        </div>
        <div className="w-px h-32 bg-gradient-to-t from-[#00d9ff]/60 to-transparent"></div>
      </div>

      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-[#0a0e1f]/80 backdrop-blur-md border-b border-[#00d9ff]/20 z-40">
        <div className="container mx-auto px-4 lg:px-16 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#00d9ff]" />
              <span className="text-[#00d9ff] font-bold text-lg">{profile.name.split(' ')[0]};</span>
            </div>

            <nav className="hidden md:flex items-center gap-4 lg:gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm transition-all duration-300 font-mono ${
                    activeSection === item.id
                      ? 'text-[#00d9ff] drop-shadow-lg'
                      : 'text-[#7a8a98] hover:text-[#00d9ff]'
                  }`}
                  data-testid={`nav-${item.id}`}
                >
                  <span className="text-[#00d9ff]">{'<'}</span>{item.label}<span className="text-[#00d9ff]">{'>'}</span>
                </button>
              ))}
            </nav>

            <button
              className="md:hidden p-2 text-[#00d9ff] hover:text-[#00d9ff]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-[#00d9ff]/20 mt-4">
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left text-sm transition-colors ${
                      activeSection === item.id
                        ? 'text-[#00d9ff]'
                        : 'text-[#7a8a98] hover:text-[#00d9ff]'
                    }`}
                  >
                    <span className="text-[#00d9ff]">{'<'}</span>{item.label}<span className="text-[#00d9ff]">{'>'}</span>
                  </button>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M0,10 L10,10 L10,0 L20,0" stroke="#00d9ff" strokeWidth="0.5" fill="none" opacity="0.2" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#circuit)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 lg:px-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-block mb-6 lg:mb-8">
                <span className="text-[#00d9ff] text-sm font-mono">{'// ENGINEERING EXCELLENCE'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8 leading-tight">
                {profile.name} is an <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] to-[#0099cc]">automation engineer</span> and <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] to-[#0099cc]">electrical specialist</span>
              </h1>
              <p className="text-[#7a8a98] mb-6 lg:mb-8 text-sm sm:text-base leading-relaxed">
                {profile.headline || profile.about}
              </p>
              <Button
                onClick={() => scrollToSection('contacts')}
                className="border border-[#00d9ff] bg-[#00d9ff]/10 hover:bg-[#00d9ff]/20 text-[#00d9ff] px-8 py-2 transition-all duration-300 hover:drop-shadow-lg font-mono"
                data-testid="contact-cta"
              >
                <Zap className="w-4 h-4 mr-2" />
                CONTACT ME
              </Button>
            </div>

            <div className="relative order-first lg:order-last">
              <div className="absolute -top-10 -left-10 w-20 lg:w-24 h-20 lg:h-24 border-2 border-[#00d9ff]/30 hidden sm:block"></div>
              <div className="absolute -bottom-10 -right-10 w-24 lg:w-32 h-24 lg:h-32 border-2 border-[#00d9ff]/30 hidden sm:block"></div>

              <div className="relative z-10">
                <div className="w-full max-w-xs sm:max-w-sm mx-auto aspect-square bg-gradient-to-br from-[#00d9ff]/10 to-[#0099cc]/10 rounded-lg border-2 border-[#00d9ff]/40 flex items-center justify-center group hover:border-[#00d9ff]/80 transition-all duration-300">
                  <CircuitBoard className="w-24 sm:w-32 h-24 sm:h-32 text-[#00d9ff] group-hover:drop-shadow-lg transition-all duration-300" />
                </div>

                <div className="mt-6 border border-[#00d9ff]/40 p-4 inline-flex items-center gap-3 mx-auto lg:mx-0 bg-[#00d9ff]/5 rounded-lg">
                  <div className="w-3 h-3 bg-[#00d9ff] rounded-full animate-pulse"></div>
                  <span className="text-[#7a8a98] text-xs sm:text-sm">
                    Currently: <span className="text-[#00d9ff] font-semibold">JAMK University</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 lg:py-24 relative">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">
              <span className="text-[#00d9ff]">{'<'}</span>projects<span className="text-[#00d9ff]">{' />'}</span>
              <span className="ml-4 text-[#00d9ff]/40 text-xl">━━━━━━━━━</span>
            </h2>
            <p className="text-[#7a8a98] text-sm mt-2">Featured automation and electrical engineering projects</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project) => (
              <div
                key={project.id}
                className="group border border-[#00d9ff]/30 hover:border-[#00d9ff]/80 transition-all duration-300 bg-[#0f1b2e]/50 hover:bg-[#0f1b2e]/80 rounded-lg overflow-hidden hover:drop-shadow-lg"
                data-testid={`project-${project.id}`}
              >
                <div className="h-40 sm:h-48 bg-gradient-to-br from-[#00d9ff]/10 to-[#0099cc]/10 overflow-hidden relative">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full ${project.image_url ? 'hidden' : 'flex'} items-center justify-center`}>
                    <CircuitBoard className="w-16 h-16 text-[#00d9ff]/30" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1b2e] via-transparent to-transparent opacity-60"></div>
                </div>
                <div className="p-4 lg:p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.technologies?.slice(0, 3).map((tech, idx) => (
                      <Badge key={idx} variant="outline" className="text-[#00d9ff] border-[#00d9ff]/40 text-xs bg-[#00d9ff]/5">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-white font-bold mb-2 text-sm lg:text-base group-hover:text-[#00d9ff] transition-colors duration-300">{project.title}</h3>
                  <p className="text-[#7a8a98] text-xs lg:text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex gap-2">
                    {project.project_url ? (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                        data-testid={`project-link-${project.id}`}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#00d9ff]/40 text-[#00d9ff] hover:bg-[#00d9ff]/10 w-full text-xs lg:text-sm transition-all duration-300"
                        >
                          Details <ExternalLink className="w-3 h-3 ml-1 lg:ml-2" />
                        </Button>
                      </a>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#00d9ff]/40 text-[#00d9ff] hover:bg-[#00d9ff]/10 w-full text-xs lg:text-sm"
                        disabled
                      >
                        Details <ExternalLink className="w-3 h-3 ml-1 lg:ml-2" />
                      </Button>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`project-github-${project.id}`}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#00d9ff]/40 text-[#00d9ff] hover:bg-[#00d9ff]/10 transition-all duration-300"
                        >
                          <Github className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 lg:py-24 bg-[#0f1b2e]/50 border-y border-[#00d9ff]/20">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">
              <span className="text-[#00d9ff]">{'<'}</span>skills<span className="text-[#00d9ff]">{' />'}</span>
              <span className="ml-4 text-[#00d9ff]/40 text-xl">━━━━━━━━━</span>
            </h2>
            <p className="text-[#7a8a98] text-sm mt-2">Technical expertise and capabilities</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedSkills).map(([category, skillList]) => (
              <div key={category} className="border border-[#00d9ff]/30 bg-[#0f1b2e]/50 rounded-lg overflow-hidden hover:border-[#00d9ff]/60 transition-all duration-300 hover:drop-shadow-lg">
                <div className="border-b border-[#00d9ff]/30 p-4 bg-[#00d9ff]/5">
                  <h3 className="text-white font-bold text-sm lg:text-base flex items-center gap-2">
                    <span className="text-[#00d9ff]">■</span>{category}
                  </h3>
                </div>
                <div className="p-4 lg:p-5">
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-[#7a8a98] border-[#00d9ff]/30 text-xs bg-[#00d9ff]/5 hover:text-[#00d9ff] hover:border-[#00d9ff]/60 transition-colors duration-300">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About & Experience Section */}
      <section id="about-me" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">
              <span className="text-[#00d9ff]">{'<'}</span>experience<span className="text-[#00d9ff]">{' />'}</span>
              <span className="ml-4 text-[#00d9ff]/40 text-xl">━━━━━━━━</span>
            </h2>
          </div>

          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx} className="border-l-2 border-[#00d9ff]/40 pl-6 py-4 hover:border-[#00d9ff]/80 transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mb-2">
                  <h3 className="text-white font-bold text-lg">{exp.title}</h3>
                  <span className="text-[#00d9ff] text-sm font-mono">{exp.period}</span>
                </div>
                <p className="text-[#7a8a98] text-sm mb-2">{exp.company} • {exp.location}</p>
                {exp.responsibilities && (
                  <ul className="text-[#7a8a98] text-sm space-y-1">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-[#00d9ff]">→</span>{resp}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacts" className="py-16 lg:py-24 bg-[#0f1b2e]/50 border-t border-[#00d9ff]/20">
        <div className="container mx-auto px-4 lg:px-16 max-w-2xl">
          <div className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">
              <span className="text-[#00d9ff]">{'<'}</span>contact<span className="text-[#00d9ff]">{' />'}</span>
              <span className="ml-4 text-[#00d9ff]/40 text-xl">━━━━━━━━</span>
            </h2>
            <p className="text-[#7a8a98] text-sm mt-2">Let's work together on your next project</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Your Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="bg-[#0a0e1f] border-[#00d9ff]/30 text-white placeholder-[#7a8a98] focus:border-[#00d9ff] focus:ring-[#00d9ff]/30 rounded-lg"
            />
            <Input
              type="email"
              placeholder="Your Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="bg-[#0a0e1f] border-[#00d9ff]/30 text-white placeholder-[#7a8a98] focus:border-[#00d9ff] focus:ring-[#00d9ff]/30 rounded-lg"
            />
            <Textarea
              placeholder="Your Message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              className="bg-[#0a0e1f] border-[#00d9ff]/30 text-white placeholder-[#7a8a98] focus:border-[#00d9ff] focus:ring-[#00d9ff]/30 rounded-lg min-h-32"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full border border-[#00d9ff] bg-[#00d9ff]/10 hover:bg-[#00d9ff]/20 text-[#00d9ff] py-2 transition-all duration-300 hover:drop-shadow-lg font-mono rounded-lg"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#00d9ff]/20 py-8 text-center text-[#7a8a98] text-sm">
        <p>Designed and built with <span className="text-[#00d9ff]">PRECISION</span> • © 2024</p>
      </footer>
    </div>
  );
};

export default Home;
