import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Music, Brain, Award, Calendar, MapPin } from 'lucide-react';
import RolodexExpertise from '../RolodexExpertise';

gsap.registerPlugin(ScrollTrigger);

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: 'music' | 'tech' | 'research';
}

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const timeline: TimelineItem[] = [
    {
      year: '1987-2025',
      title: '33 Years as Musician',
      description: 'Started music at age 5, now 38 in 2025. Extensive musical experience spanning multiple genres and performance contexts.',
      icon: Music,
      category: 'music'
    },
    {
      year: '2006-2014',
      title: 'Professional Touring & Albums',
      description: 'Released 3 studio albums while touring professionally. 9 years of active touring with flexible telemarketing job.',
      icon: Music,
      category: 'music'
    },
    {
      year: '2013',
      title: 'Promoted to Verification Manager',
      description: 'Career advancement while band was still active. Beginning of serious business focus.',
      icon: Award,
      category: 'tech'
    },
    {
      year: '2014',
      title: 'Band Ended - Career Focus',
      description: 'Band ended, began applying himself seriously. Took charge of Customer Service + Verification departments.',
      icon: Calendar,
      category: 'tech'
    },
    {
      year: '2015',
      title: 'Breakthrough Year - Quality Control',
      description: 'Scaled to handle 25+ offices corporationwide. Built Quality Control division with direct CEO reporting. Reduced cancel rates from 33% to 12.8% (66% reduction).',
      icon: Award,
      category: 'tech'
    },
    {
      year: '2015-2018',
      title: 'Director of Business Operations',
      description: 'Built and led Collections team, consistently broke monthly records. Promoted to Director managing 6 departments: Verification, Customer Care, Retention, Collections, Quality Control, Agent Relations.',
      icon: Award,
      category: 'tech'
    },
    {
      year: '2017',
      title: 'Legal & Contract Overhaul',
      description: 'Rewrote company warranties and service agreements, overhauling all contract language. Top salesman 13 times agency, 7 times corporation. Employee of the month 4 times.',
      icon: Award,
      category: 'tech'
    },
    {
      year: '2018',
      title: 'Disability & Recovery',
      description: 'Went on disability due to car accident (broke both feet). During recovery, raised BBB rating from C- to A+ in 6 months.',
      icon: Calendar,
      category: 'tech'
    },
    {
      year: '2020',
      title: 'Company Closure & Education',
      description: 'Company folded during pandemic. Enrolled at CSUN using grants/scholarships. Over $2M in personal sales and retention.',
      icon: Brain,
      category: 'research'
    },
    {
      year: '2025',
      title: 'ConversaTrait AI & Graduation',
      description: 'Graduated 6 months ago. Developed ConversaTrait psychoanalytical app with 21+ modes. Currently preparing investor pitch.',
      icon: Award,
      category: 'research'
    }
  ];



  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline animation
      gsap.fromTo(
        '.timeline-item',
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'music': return 'text-purple-400';
      case 'tech': return 'text-chad-red';
      case 'research': return 'text-blue-400';
      case 'AI': return 'text-chad-red';
      case 'Technical': return 'text-blue-400';
      case 'Creative': return 'text-purple-400';
      case 'Human': return 'text-green-400';
      case 'Business': return 'text-yellow-400';
      default: return 'text-chad-white';
    }
  };

  return (
    <section ref={sectionRef} className="py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-chad-black mb-6">
            About <span className="text-chad-red">Chad</span>
          </h2>
          <p className="text-xl text-chad-black/70 max-w-3xl mx-auto leading-relaxed">
            33-year musical journey from age 5 to 38, with 9 years of professional touring (2006-2014). 
            Explosive business success: $2M+ in sales/retention, 13x top agency salesman, 
            7x top corporation salesman, 66% reduction in company cancellations, and 6-month BBB rating transformation from C- to A+.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Timeline */}
          <div>
            <motion.h3
              className="text-3xl font-bold text-chad-black mb-8 flex items-center"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Calendar className="w-8 h-8 text-chad-red mr-3" />
              Journey
            </motion.h3>

            <div ref={timelineRef} className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  className="timeline-item flex items-start space-x-4 p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl border border-chad-red/30 hover:border-chad-red/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-chad-red/20 transform hover:-translate-y-1 hover:scale-[1.02]"
                  style={{
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-chad-white to-gray-100 border-2 border-current flex items-center justify-center ${getCategoryColor(item.category)} shadow-lg`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-chad-red font-bold">{item.year}</span>
                      <span className={`text-xs px-2 py-1 rounded-full bg-current/20 ${getCategoryColor(item.category)}`}>
                        {item.category.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Skills & Stats */}
          <div className="space-y-12">
            {/* Rotating Rolodex Expertise */}
            <div className="skills-section">
              <motion.h3
                className="text-3xl font-bold text-chad-black mb-8 flex items-center"
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Brain className="w-8 h-8 text-chad-red mr-3" />
                Core Expertise
              </motion.h3>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <RolodexExpertise />
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 gap-6"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {[
                { number: '33', label: 'Years as Musician' },
                { number: '66%', label: 'Cancellation Reduction' },
                { number: '25+', label: 'Offices Managed' },
                { number: '$2M+', label: 'Sales + Retention Revenue' }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl border border-chad-red/30 hover:border-chad-red/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-chad-red/20 transform hover:-translate-y-1 hover:scale-[1.02]"
                  style={{
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="text-3xl font-bold text-chad-red mb-2 drop-shadow-lg">{stat.number}</div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Location & Contact */}
            <motion.div
              className="p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl border border-chad-red/30 hover:border-chad-red/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-chad-red/20 transform hover:-translate-y-1"
              style={{
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-6 h-6 text-chad-red" />
                <span className="text-white font-semibold">Based in Lake Balboa, CA</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Available for research collaborations, speaking engagements, investor meetings, and 
                consulting on AI applications and business operations. Currently preparing ConversaTrait investor pitch.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;