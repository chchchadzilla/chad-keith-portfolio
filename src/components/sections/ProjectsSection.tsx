import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Play, Code, Brain, Music, Award, Calendar } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: 'AI Research' | 'Music Tech' | 'Open Source' | 'Industry Project';
  description: string;
  longDescription: string;
  technologies: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  status: 'Live' | 'In Development' | 'Research' | 'Completed';
  year: string;
  highlights: string[];
}

const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const projects: Project[] = [
    {
      id: '1',
      title: 'ConversaTrait AI Platform',
      category: 'AI Research',
      description: 'Revolutionary conversation analysis platform that detects communication patterns, authenticity markers, and emotional intelligence.',
      longDescription: 'ConversaTrait represents a breakthrough in natural language processing and conversation analysis. Using advanced machine learning models, it can detect subtle patterns in communication that reveal personality traits, emotional states, and authenticity markers. The platform has applications in customer service, therapeutic settings, and social media analysis.',
      technologies: ['Python', 'TensorFlow', 'BERT', 'React', 'Node.js', 'PostgreSQL'],
      image: '/images/ComfyUI_01026_.png',
      demoUrl: '#conversatrait',
      status: 'Live',
      year: '2023-2024',
      highlights: [
        '95% accuracy in authenticity detection',
        'Real-time conversation analysis',
        'Multi-language support',
        'GDPR compliant privacy protection'
      ]
    },
    {
      id: '2',
      title: 'Neural Music Composition Engine',
      category: 'Music Tech',
      description: 'AI-powered music composition tool that generates music based on emotional context and performance history.',
      longDescription: 'Combining my musical background with AI research, this engine generates original compositions by analyzing emotional patterns in existing music and mapping them to neural network architectures. The system can create music in various styles while maintaining emotional coherence.',
      technologies: ['Python', 'PyTorch', 'MIDI', 'Web Audio API', 'React'],
      image: '/images/ComfyUI_01039_.png',
      githubUrl: 'https://github.com/chadkeith/neural-music',
      status: 'In Development',
      year: '2023',
      highlights: [
        'Genre-adaptive composition',
        'Emotional context understanding',
        'Real-time MIDI generation',
        'Collaboration with human musicians'
      ]
    },
    {
      id: '3',
      title: 'Sentiment Analysis Research',
      category: 'AI Research',
      description: 'Published research on advanced sentiment analysis techniques for social media and customer feedback.',
      longDescription: 'Comprehensive research project examining the limitations of traditional sentiment analysis and proposing novel approaches that consider context, sarcasm, and cultural nuances. The work has been cited in multiple academic papers and industry implementations.',
      technologies: ['Python', 'NLP Libraries', 'Statistical Analysis', 'Research Methodology'],
      image: '/images/ComfyUI_01015_.png',
      status: 'Completed',
      year: '2022',
      highlights: [
        'Published in 3 peer-reviewed journals',
        '15% improvement over baseline models',
        'Cross-cultural sentiment validation',
        'Open-source dataset contribution'
      ]
    },
    {
      id: '4',
      title: 'Performance Analytics Platform',
      category: 'Music Tech',
      description: 'Analytics platform for musicians to track performance metrics, audience engagement, and career development.',
      longDescription: 'Built from my touring experience, this platform helps musicians understand their performance data, track audience engagement, and make data-driven decisions about their career. It integrates with various music platforms and provides actionable insights.',
      technologies: ['React', 'Node.js', 'MongoDB', 'D3.js', 'Music APIs'],
      image: '/images/ComfyUI_01028_.png',
      demoUrl: 'https://performance-analytics.demo',
      status: 'Live',
      year: '2021-2022',
      highlights: [
        '500+ active musician users',
        'Integration with 10+ platforms',
        'Predictive career modeling',
        'Revenue optimization insights'
      ]
    },
    {
      id: '5',
      title: 'Open Source NLP Toolkit',
      category: 'Open Source',
      description: 'Comprehensive toolkit for natural language processing with focus on conversation analysis and pattern detection.',
      longDescription: 'An open-source contribution to the NLP community, providing tools and utilities for conversation analysis, pattern detection, and linguistic feature extraction. The toolkit is designed to be modular and extensible.',
      technologies: ['Python', 'spaCy', 'NLTK', 'scikit-learn', 'Docker'],
      image: '/images/ComfyUI_00993_.png',
      githubUrl: 'https://github.com/chadkeith/nlp-toolkit',
      status: 'Live',
      year: '2023',
      highlights: [
        '1000+ GitHub stars',
        'Used by 50+ researchers',
        'Comprehensive documentation',
        'Active community contributions'
      ]
    },
    {
      id: '6',
      title: 'AI Ethics Framework',
      category: 'AI Research',
      description: 'Research framework for ethical AI development in creative industries and human-centered applications.',
      longDescription: 'Developing comprehensive guidelines and frameworks for ethical AI development, particularly in applications that involve human creativity and emotional intelligence. This work addresses bias, transparency, and human agency in AI systems.',
      technologies: ['Research Methodology', 'Policy Analysis', 'Stakeholder Engagement'],
      image: '/images/ComfyUI_01013_.png',
      status: 'Research',
      year: '2024',
      highlights: [
        'Industry partnership with 5 companies',
        'Policy recommendations published',
        'Speaking at 3 major conferences',
        'Multi-disciplinary collaboration'
      ]
    },
    {
      id: '7',
      title: 'Visual AI Art Generator',
      category: 'AI Research',
      description: 'Cutting-edge generative AI system for creating unique visual art from textual descriptions and emotional contexts.',
      longDescription: 'A sophisticated AI art generation platform that combines multiple neural network architectures to create visually stunning artwork. The system understands emotional context, artistic styles, and can generate coherent visual narratives.',
      technologies: ['PyTorch', 'Diffusion Models', 'CLIP', 'FastAPI', 'React'],
      image: '/images/ComfyUI_00945_.png',
      demoUrl: 'https://visual-ai-demo.com',
      status: 'Live',
      year: '2024',
      highlights: [
        'State-of-the-art image generation',
        'Multi-modal understanding',
        'Real-time generation pipeline',
        'Artist collaboration tools'
      ]
    }
  ];

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'bg-green-500';
      case 'In Development': return 'bg-yellow-500';
      case 'Research': return 'bg-blue-500';
      case 'Completed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI Research': return Brain;
      case 'Music Tech': return Music;
      case 'Open Source': return Code;
      case 'Industry Project': return Award;
      default: return Code;
    }
  };

  return (
    <section className="py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-chad-white mb-6">
            Featured <span className="text-chad-white">Projects</span>
          </h2>
          <p className="text-xl text-chad-white/90 max-w-3xl mx-auto leading-relaxed">
            A showcase of innovative work spanning AI research, music technology, 
            and open-source contributions that bridge creativity and cutting-edge technology.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                filter === category
                  ? 'bg-chad-white text-chad-red'
                  : 'bg-chad-white/20 text-chad-white hover:bg-chad-white/30 hover:text-chad-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => {
              const CategoryIcon = getCategoryIcon(project.category);
              
              return (
                <motion.div
                  key={`${filter}-${project.id}`}
                  className="bg-chad-white/10 rounded-xl overflow-hidden border border-chad-white/20 hover:border-chad-white/40 transition-all duration-300 group cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: 'easeOut'
                  }}
                  whileHover={{ y: -4 }}
                  layout
                >
                  {/* Project Image */}
                  <div className="relative h-48 bg-chad-black/20 flex items-center justify-center overflow-hidden">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/ComfyUI_01026_.png';
                      }}
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-chad-black/30 to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    
                    {/* Category Icon */}
                    <div className="absolute top-4 right-4">
                      <div className="w-10 h-10 bg-chad-black/50 rounded-full flex items-center justify-center">
                        <CategoryIcon className="w-5 h-5 text-chad-white" />
                      </div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-chad-white text-sm font-medium">{project.category}</span>
                      <span className="text-chad-white/60 text-sm">{project.year}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-chad-white mb-3 group-hover:text-chad-white/80 transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-chad-white/80 text-sm leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-chad-white/20 text-chad-white text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-chad-white/10 text-chad-white/60 text-xs rounded">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      {project.demoUrl && (
                        <button className="flex items-center space-x-2 text-chad-white hover:text-chad-white/80 transition-colors">
                          <Play className="w-4 h-4" />
                          <span className="text-sm font-medium">Demo</span>
                        </button>
                      )}
                      {project.githubUrl && (
                        <button className="flex items-center space-x-2 text-chad-white/60 hover:text-chad-white transition-colors">
                          <Github className="w-4 h-4" />
                          <span className="text-sm font-medium">Code</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-chad-black/90 border border-chad-white/30 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-3xl font-bold text-chad-white mb-2">{selectedProject.title}</h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-chad-red font-medium">{selectedProject.category}</span>
                      <span className="text-chad-white/60">{selectedProject.year}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(selectedProject.status)}`}>
                        {selectedProject.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="text-chad-white/60 hover:text-chad-red transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-4 mb-6">
                      {selectedProject.demoUrl && (
                        <motion.a
                          href={selectedProject.demoUrl}
                          className="flex items-center space-x-2 bg-chad-red hover:bg-chad-red/80 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play className="w-5 h-5" />
                          <span>Live Demo</span>
                        </motion.a>
                      )}
                      {selectedProject.githubUrl && (
                        <motion.a
                          href={selectedProject.githubUrl}
                          className="flex items-center space-x-2 border border-chad-red text-chad-red hover:bg-chad-red hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Github className="w-5 h-5" />
                          <span>View Code</span>
                        </motion.a>
                      )}
                    </div>
                  </div>

                  <div>
                    {/* Description */}
                    <p className="text-chad-white/80 leading-relaxed mb-6">
                      {selectedProject.longDescription}
                    </p>

                    {/* Highlights */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-chad-white mb-3">Key Highlights</h4>
                      <ul className="space-y-2">
                        {selectedProject.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-chad-red rounded-full mt-2 flex-shrink-0" />
                            <span className="text-chad-white/70">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h4 className="text-lg font-semibold text-chad-white mb-3">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-chad-red/10 text-chad-red rounded-lg text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectsSection;