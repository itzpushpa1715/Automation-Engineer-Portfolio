import React, { useState, useEffect } from 'react';
import { Mail, Linkedin, Github, Send, ExternalLink, Square, Code, Award } from 'lucide-react';
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
  
  // State for all data
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data on mount
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
        projectsAPI.getAll(true), // Only visible projects
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

  // Group skills by category
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
      <div className="min-h-screen bg-[#282C33] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#282C33] text-white" style={{ fontFamily: 'Fira Code, monospace' }}>
      {/* Fixed Left Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-16 hidden md:flex flex-col items-center justify-between py-8 z-50">
        <div className="w-px h-32 bg-[#ABB2BF]"></div>
        <div className="flex flex-col gap-4">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-[#ABB2BF] hover:text-[#C778DD] transition-colors">
            <Github className="w-6 h-6" />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#ABB2BF] hover:text-[#C778DD] transition-colors">
            <Linkedin className="w-6 h-6" />
          </a>
          <a href={`mailto:${profile.email}`} className="text-[#ABB2BF] hover:text-[#C778DD] transition-colors">
            <Mail className="w-6 h-6" />
          </a>
        </div>
        <div className="w-px h-32 bg-[#ABB2BF]"></div>
      </div>

      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-[#282C33] border-b border-[#1E1E1E] z-40">
        <div className="container mx-auto px-4 md:px-16 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Square className="w-4 h-4 text-[#C778DD]" />
              <span className="text-white font-bold">{profile.name.split(' ')[0]}</span>
            </div>

            <nav className="flex items-center gap-8">
              {[
                { id: 'home', label: 'home' },
                { id: 'projects', label: 'works' },
                { id: 'skills', label: 'skills' },
                { id: 'about-me', label: 'about-me' },
                { id: 'contacts', label: 'contacts' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm transition-colors ${
                    activeSection === item.id
                      ? 'text-white'
                      : 'text-[#ABB2BF] hover:text-white'
                  }`}
                >
                  <span className="text-[#C778DD]">#</span>{item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-semibold mb-8">
                {profile.name} is an <span className="text-[#C778DD]">automation engineer</span> and{' '}
                <span className="text-[#C778DD]">electrical specialist</span>
              </h1>
              <p className="text-[#ABB2BF] mb-8">
                {profile.headline || profile.about}
              </p>
              <Button 
                onClick={() => scrollToSection('contacts')}
                className="border border-[#C778DD] bg-transparent hover:bg-[#C778DD]/10 text-white px-6"
              >
                Contact me!!
              </Button>
            </div>

            <div className="relative">
              <div className="absolute -top-10 -left-10 w-20 h-20 border border-[#C778DD]"></div>
              <div className="absolute -bottom-10 -right-10 w-24 h-24 border border-[#C778DD]"></div>
              
              <div className="relative z-10">
                <div className="w-full max-w-sm mx-auto aspect-square bg-gradient-to-br from-[#1E1E1E] to-[#282C33] rounded-sm border border-[#C778DD] flex items-center justify-center">
                  <Code className="w-32 h-32 text-[#C778DD]" />
                </div>
                
                <div className="mt-4 border border-[#ABB2BF] p-3 inline-flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#C778DD]"></div>
                  <span className="text-[#ABB2BF] text-sm">
                    Currently studying at <span className="text-white">JAMK University</span>
                  </span>
                </div>
              </div>

              <div className="absolute top-1/2 right-0 dot-grid opacity-50">
                {[...Array(25)].map((_, i) => (
                  <span key={i}></span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-16">
          <div className="max-w-3xl mx-auto relative">
            <div className="border border-[#ABB2BF] p-8 relative">
              <span className="absolute -top-4 -left-2 text-5xl text-[#ABB2BF]">"</span>
              <p className="text-white text-xl mb-4">
                With great skills comes great responsibility in automation
              </p>
              <span className="absolute -bottom-8 -right-2 text-5xl text-[#ABB2BF]">"</span>
            </div>
            <div className="mt-4 border border-[#ABB2BF] px-4 py-2 inline-block ml-auto">
              <span className="text-[#ABB2BF]">- Engineer's Motto</span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20">
        <div className="container mx-auto px-4 md:px-16">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-medium">
              <span className="text-[#C778DD]">#</span>projects
              <span className="ml-4 text-[#C778DD]">━━━━━━━━━━━━</span>
            </h2>
            <button className="text-white hover:text-[#C778DD] transition-colors">
              View all ~~&gt;
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="border border-[#ABB2BF] group hover:border-[#C778DD] transition-colors">
                <div className="h-48 bg-gradient-to-br from-[#1E1E1E] to-[#282C33] overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="border-t border-[#ABB2BF] p-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.technologies.slice(0, 3).map((tech, idx) => (
                      <span key={idx} className="text-[#ABB2BF] text-xs">{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <h3 className="text-white font-medium mb-2">{project.title}</h3>
                  <p className="text-[#ABB2BF] text-sm mb-4">{project.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-[#C778DD] text-white hover:bg-[#C778DD]/10 w-full"
                  >
                    View Details <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-[#1E1E1E]">
        <div className="container mx-auto px-4 md:px-16">
          <h2 className="text-2xl font-medium mb-12">
            <span className="text-[#C778DD]">#</span>skills
            <span className="ml-4 text-[#C778DD]">━━━━━━━━━━━━</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(groupedSkills).map(([category, skillList]) => (
              <div key={category} className="border border-[#ABB2BF]">
                <div className="border-b border-[#ABB2BF] p-3">
                  <h3 className="text-white font-medium">{category}</h3>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill, idx) => (
                      <span key={idx} className="text-[#ABB2BF] text-sm">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about-me" className="py-20">
        <div className="container mx-auto px-4 md:px-16">
          <h2 className="text-2xl font-medium mb-12">
            <span className="text-[#C778DD]">#</span>about-me
            <span className="ml-4 text-[#C778DD]">━━━━━━━━━━━━</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-[#ABB2BF] mb-6">{profile.about}</p>
              
              <div className="mt-8">
                <h3 className="text-white font-medium mb-4">
                  <span className="text-[#C778DD]">#</span>experience
                </h3>
                <div className="space-y-6">
                  {experience.map((exp) => (
                    <div key={exp.id} className="border border-[#ABB2BF] p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-white font-medium">{exp.title}</h4>
                          <p className="text-[#C778DD] text-sm">{exp.company}</p>
                        </div>
                        <Badge className="bg-[#C778DD] text-white">{exp.period.split(' ')[0]}</Badge>
                      </div>
                      <p className="text-[#ABB2BF] text-sm">{exp.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">
                <span className="text-[#C778DD]">#</span>education
              </h3>
              {education.map((edu) => (
                <div key={edu.id} className="border border-[#ABB2BF] p-4 mb-6">
                  <h4 className="text-white font-medium mb-2">{edu.degree}</h4>
                  <p className="text-[#C778DD] text-sm mb-2">{edu.institution}</p>
                  <p className="text-[#ABB2BF] text-sm mb-3">{edu.period}</p>
                  <p className="text-[#ABB2BF] text-sm">{edu.description}</p>
                </div>
              ))}

              <h3 className="text-white font-medium mb-4 mt-8">
                <span className="text-[#C778DD]">#</span>certifications
              </h3>
              <div className="border border-[#ABB2BF] p-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-[#C778DD]" />
                    <span className="text-[#ABB2BF] text-sm">{cert.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacts" className="py-20 bg-[#1E1E1E]">
        <div className="container mx-auto px-4 md:px-16">
          <h2 className="text-2xl font-medium mb-12">
            <span className="text-[#C778DD]">#</span>contacts
            <span className="ml-4 text-[#C778DD]">━━━━━━━━━━━━</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-[#ABB2BF] mb-8">
                I'm interested in freelance opportunities and collaboration. However, if you have other request or question, don't hesitate to contact me.
              </p>
              <div className="border border-[#ABB2BF] p-4">
                <h3 className="text-white font-medium mb-4">Message me here</h3>
                <div className="space-y-2">
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-[#ABB2BF] hover:text-[#C778DD] transition-colors">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </a>
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#ABB2BF] hover:text-[#C778DD] transition-colors">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="bg-transparent border-[#ABB2BF] text-white placeholder:text-[#ABB2BF]"
                />
              </div>
              <div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-transparent border-[#ABB2BF] text-white placeholder:text-[#ABB2BF]"
                />
              </div>
              <div>
                <Textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="bg-transparent border-[#ABB2BF] text-white placeholder:text-[#ABB2BF]"
                />
              </div>
              <Button 
                type="submit" 
                className="border border-[#C778DD] bg-transparent hover:bg-[#C778DD]/10 text-white w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#ABB2BF] py-8">
        <div className="container mx-auto px-4 md:px-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Square className="w-4 h-4 text-[#C778DD]" />
              <span className="text-white font-medium">{profile.name}</span>
              <span className="text-[#ABB2BF]">{profile.email}</span>
            </div>
            <p className="text-[#ABB2BF] text-sm">© 2025. Made with passion</p>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-[#ABB2BF] hover:text-[#C778DD] transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#ABB2BF] hover:text-[#C778DD] transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
