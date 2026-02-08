import React, { useState, useEffect } from 'react';
import { Mail, Linkedin, Github, Send, ExternalLink, Square, Figma } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { toast } from '../hooks/use-toast';
import { personalInfo, skills, experience, education, certifications, projects } from '../mock';

const Home = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Update active section based on scroll position
      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'education', 'certifications', 'contact'];
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

    // Mock form submission - store in localStorage
    setTimeout(() => {
      const message = {
        ...formData,
        id: Date.now(),
        timestamp: new Date().toISOString()
      };
      
      const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      existingMessages.push(message);
      localStorage.setItem('contactMessages', JSON.stringify(existingMessages));

      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });

      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleDownloadResume = () => {
    toast({
      title: "Resume Download",
      description: "Resume download will be available soon.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Navigation Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/80 backdrop-blur-lg shadow-md' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-slate-700 flex items-center justify-center text-white font-bold text-xl">
                PK
              </div>
              <span className="text-xl font-bold text-slate-800">{personalInfo.name}</span>
            </div>

            <nav className="hidden md:flex items-center space-x-1">
              {['home', 'about', 'skills', 'projects', 'experience', 'education', 'certifications', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                    activeSection === section
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {section}
                </button>
              ))}
            </nav>

            <Button onClick={handleDownloadResume} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Resume
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        {/* Parallax Background Elements */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* 3D Floating Elements */}
            <div 
              className="mb-8 inline-block"
              style={{ 
                transform: `translateY(${Math.sin(scrollY * 0.01) * 20}px) rotateY(${scrollY * 0.1}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-slate-600 flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <Cpu className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
              {personalInfo.name}
            </h1>
            <p className="text-2xl md:text-3xl text-slate-600 font-light mb-8">
              {personalInfo.title}
            </p>
            <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              {personalInfo.summary}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button onClick={() => scrollToSection('contact')} size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Mail className="w-5 h-5 mr-2" />
                Get In Touch
              </Button>
              <Button onClick={() => scrollToSection('projects')} variant="outline" size="lg" className="border-slate-300 hover:bg-slate-100">
                View Projects
              </Button>
            </div>

            <div className="flex justify-center gap-4">
              <a href={`mailto:${personalInfo.email}`} className="p-3 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <Mail className="w-5 h-5 text-slate-700" />
              </a>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <Linkedin className="w-5 h-5 text-slate-700" />
              </a>
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <Github className="w-5 h-5 text-slate-700" />
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-slate-400" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 mb-6 text-center">About Me</h2>
            <Separator className="mb-12 mx-auto w-24 h-1 bg-blue-600" />
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{personalInfo.location}</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-blue-600" />
                    Phone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{personalInfo.phone}</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{personalInfo.email}</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Available for Opportunities</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 text-center">Skills & Expertise</h2>
          <Separator className="mb-12 mx-auto w-24 h-1 bg-blue-600" />

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-600" />
                  Programming
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.programmingLanguages.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-600" />
                  Automation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.automation.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  AI & ML
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.aiMachineLearning.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-blue-600" />
                  Design Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.designTools.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  Testing & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.testing.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-600" />
                  Industry 4.0
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.industry40.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 text-center">Featured Projects</h2>
          <Separator className="mb-12 mx-auto w-24 h-1 bg-blue-600" />

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <Card key={project.id} className="shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-slate-100 relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 right-4 bg-blue-600">{project.status}</Badge>
                </div>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">{tech}</Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 text-center">Work Experience</h2>
          <Separator className="mb-12 mx-auto w-24 h-1 bg-blue-600" />

          <div className="max-w-4xl mx-auto space-y-8">
            {experience.map((exp, idx) => (
              <Card key={exp.id} className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{exp.title}</CardTitle>
                      <CardDescription className="text-base">
                        <div className="flex items-center gap-2 mb-1">
                          <Briefcase className="w-4 h-4" />
                          <span className="font-semibold text-slate-700">{exp.company}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {exp.period}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {exp.location}
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">{idx + 1}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {exp.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2 text-slate-600">
                        <span className="text-blue-600 mt-1.5">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 text-center">Education</h2>
          <Separator className="mb-12 mx-auto w-24 h-1 bg-blue-600" />

          <div className="max-w-4xl mx-auto">
            {education.map((edu) => (
              <Card key={edu.id} className="shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{edu.degree}</CardTitle>
                      <CardDescription className="text-base">
                        <div className="mb-1">
                          <span className="font-semibold text-slate-700">{edu.institution}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {edu.period}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {edu.location}
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{edu.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-700">Key Highlights:</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {edu.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-blue-600">✓</span>
                          <span className="text-sm text-slate-600">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 text-center">Certifications</h2>
          <Separator className="mb-12 mx-auto w-24 h-1 bg-blue-600" />

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
            {certifications.map((cert) => (
              <Card key={cert.id} className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-slate-700 font-medium">{cert.name}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 text-center">Get In Touch</h2>
          <Separator className="mb-12 mx-auto w-24 h-1 bg-blue-600" />

          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Send Me a Message</CardTitle>
                <CardDescription>I'll get back to you as soon as possible.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                    />
                  </div>
                  <div>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                    />
                  </div>
                  <div>
                    <Textarea
                      name="message"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="border-slate-300"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-slate-400 mb-4">
              © 2025 {personalInfo.name}. All rights reserved.
            </p>
            <div className="flex justify-center gap-4">
              <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
