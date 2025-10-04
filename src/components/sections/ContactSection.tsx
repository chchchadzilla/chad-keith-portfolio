import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Send, CheckCircle, Calendar, MessageSquare } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'collaboration' | 'speaking' | 'consulting' | 'other';
}

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'collaboration'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'collaboration'
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'chad@chadkeith.com',
      href: 'mailto:chad@chadkeith.com',
      description: 'Primary contact for all inquiries'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (512) 555-0123',
      href: 'tel:+15125550123',
      description: 'Available for urgent matters'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Austin, Texas',
      href: 'https://maps.google.com/?q=Austin,Texas',
      description: 'Available for local meetings'
    },
    {
      icon: Calendar,
      label: 'Schedule',
      value: 'Book a Call',
      href: 'https://calendly.com/chadkeith',
      description: 'Schedule a consultation'
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/chadkeith',
      color: 'hover:text-gray-400'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/chadkeith',
      color: 'hover:text-blue-400'
    },
    {
      icon: Twitter,
      label: 'Twitter',
      href: 'https://twitter.com/chadkeith',
      color: 'hover:text-blue-400'
    },
    {
      icon: MessageSquare,
      label: 'Discord',
      href: 'https://discord.gg/chadkeith',
      color: 'hover:text-purple-400'
    }
  ];

  const inquiryTypes = [
    { value: 'collaboration', label: 'Research Collaboration', icon: '🔬' },
    { value: 'speaking', label: 'Speaking Engagement', icon: '🎤' },
    { value: 'consulting', label: 'Consulting Services', icon: '💼' },
    { value: 'other', label: 'Other Inquiry', icon: '💬' }
  ];

  return (
    <section ref={sectionRef} className="py-20 px-6 lg:px-12 bg-chad-black">
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
            Let's <span className="text-chad-red">Connect</span>
          </h2>
          <p className="text-xl text-chad-white/70 max-w-3xl mx-auto leading-relaxed">
            Ready to explore the future of AI and human creativity together? 
            I'm always excited to discuss new projects, research opportunities, and innovative collaborations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-chad-white/5 rounded-2xl p-8 border border-chad-red/20">
              <h3 className="text-2xl font-bold text-chad-white mb-6 flex items-center">
                <Send className="w-6 h-6 text-chad-red mr-3" />
                Send a Message
              </h3>

              {isSubmitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-chad-white mb-2">Message Sent!</h4>
                  <p className="text-chad-white/70">
                    Thank you for reaching out. I'll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Inquiry Type */}
                  <div>
                    <label className="block text-chad-white font-medium mb-3">Inquiry Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {inquiryTypes.map((type) => (
                        <motion.label
                          key={type.value}
                          className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                            formData.type === type.value
                              ? 'border-chad-red bg-chad-red/10 text-chad-red'
                              : 'border-chad-white/20 text-chad-white/70 hover:border-chad-red/50'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <input
                            type="radio"
                            name="type"
                            value={type.value}
                            checked={formData.type === type.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <span className="text-lg">{type.icon}</span>
                          <span className="text-sm font-medium">{type.label}</span>
                        </motion.label>
                      ))}
                    </div>
                  </div>

                  {/* Name and Email */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-chad-white font-medium mb-2">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-chad-black/50 border border-chad-red/20 rounded-lg p-3 text-chad-white placeholder-chad-white/50 focus:border-chad-red focus:outline-none transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-chad-white font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-chad-black/50 border border-chad-red/20 rounded-lg p-3 text-chad-white placeholder-chad-white/50 focus:border-chad-red focus:outline-none transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-chad-white font-medium mb-2">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-chad-black/50 border border-chad-red/20 rounded-lg p-3 text-chad-white placeholder-chad-white/50 focus:border-chad-red focus:outline-none transition-colors"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-chad-white font-medium mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full bg-chad-black/50 border border-chad-red/20 rounded-lg p-3 text-chad-white placeholder-chad-white/50 focus:border-chad-red focus:outline-none transition-colors resize-none"
                      placeholder="Tell me more about your project, goals, and how we might work together..."
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-chad-red hover:bg-chad-red/80 disabled:bg-chad-red/50 text-white py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Contact Details */}
            <div>
              <h3 className="text-2xl font-bold text-chad-white mb-6">Get In Touch</h3>
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    className="flex items-start space-x-4 p-4 bg-chad-white/5 rounded-xl border border-chad-red/10 hover:border-chad-red/30 transition-all duration-300 group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-12 h-12 bg-chad-red/10 rounded-lg flex items-center justify-center group-hover:bg-chad-red/20 transition-colors">
                      <item.icon className="w-6 h-6 text-chad-red" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-chad-white group-hover:text-chad-red transition-colors">
                        {item.label}
                      </h4>
                      <p className="text-chad-red font-medium">{item.value}</p>
                      <p className="text-chad-white/60 text-sm">{item.description}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-2xl font-bold text-chad-white mb-6">Follow My Work</h3>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-3 p-4 bg-chad-white/5 rounded-xl border border-chad-red/10 hover:border-chad-red/30 text-chad-white transition-all duration-300 ${social.color}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-6 h-6" />
                    <span className="font-medium">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-gradient-to-r from-chad-red/10 to-chad-red/5 rounded-xl p-6 border border-chad-red/20">
              <h4 className="text-lg font-semibold text-chad-white mb-3">Current Availability</h4>
              <div className="space-y-2 text-chad-white/80 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Available for new research collaborations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Speaking engagements (Q2 2025)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span>Consulting projects (limited slots)</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-chad-red/20">
                <p className="text-chad-white/70 text-sm">
                  Response time: Within 24 hours
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="text-center mt-16 pt-8 border-t border-chad-red/20"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-chad-white/60">
            © 2024 Chad Keith. All rights reserved. | Built with passion for AI and human creativity.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;