"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDynamicMetadata } from '@/lib/dynamic-metadata';
import { pageMetadata } from '@/lib/metadata';
import {
  Heart,
  Users,
  BookOpen,
  GraduationCap,
  Award,
  Zap,
  Target,
  Lightbulb,
  Globe,
  Star,
  TrendingUp,
  Code,
  Shield,
  Rocket,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  Brain,
  Briefcase,
  Trophy
} from 'lucide-react';
import Navigation from '@/components/navigation';
import ScrollAnimatedSection from '@/components/scroll-animated-section';
import Image from 'next/image';
import { LucideIcon } from 'lucide-react';

interface AboutSection {
  id: string;
  title: string;
  icon: LucideIcon;
  content: React.ReactNode;
  color: string;
}

const FloatingIcon = ({ icon: Icon, className, delay = 0 }: { icon: LucideIcon, className?: string, delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: [0.3, 0.8, 0.3],
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
      className={`absolute ${className}`}
    >
      <Icon className="w-6 h-6 text-blue-400/30" />
    </motion.div>
  );
};

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState<string>('introduction');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['introduction']));

  // Dynamic metadata
  useDynamicMetadata({ ...pageMetadata.about, path: '/about' });

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const sections: AboutSection[] = [
    {
      id: 'introduction',
      title: 'What is Chameleon FCDS?',
      icon: Sparkles,
      color: 'from-blue-400 to-cyan-400',
      content: (
        <div className="space-y-6">
          <div className="text-center">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-green-500 p-1">
                <div className="w-full h-full rounded-full bg-[#030303] flex items-center justify-center">
                  <Image
                    src="/images/1212-removebg-preview.png"
                    alt="Chameleon FCDS Logo"
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
              </div>
          </div>

          <p className="text-white/80 leading-relaxed text-center text-lg">
            <strong className="text-blue-400">Chameleon FCDS</strong> is a revolutionary educational platform designed specifically for students at the Faculty of Computer and Data Science (FCDS) at Alexandria University. We bridge the gap between academic learning and real-world application, empowering the next generation of tech innovators.
          </p>

          <div className="flex items-center gap-2 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 justify-center">
            <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <span className="text-blue-400 text-sm font-medium">Transforming Education Through Innovation</span>
          </div>
        </div>
      )
    },
    {
      id: 'mission',
      title: 'Our Mission & Vision',
      icon: Target,
      color: 'from-green-400 to-emerald-400',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-400 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Mission
            </h4>
            <div className="space-y-3 pl-7">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">To democratize access to quality education and career guidance for FCDS students</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">To create a supportive community where students can thrive academically and professionally</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">To bridge the gap between theoretical knowledge and practical application</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-400 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Vision
            </h4>
            <div className="space-y-3 pl-7">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">To be the leading educational companion for FCDS students worldwide</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">To foster innovation and excellence in computer science and data science education</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">To empower students to become future leaders in technology</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-green-500/10 rounded-lg border border-green-500/30">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-6 h-6 text-green-400" />
              <span className="text-green-400 font-semibold">Our Core Values</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-white/80 text-sm">Community First</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Lightbulb className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-white/80 text-sm">Innovation Driven</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-white/80 text-sm">Excellence Focused</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'offerings',
      title: 'What We Offer',
      icon: BookOpen,
      color: 'from-purple-400 to-pink-400',
      content: (
        <div className="space-y-6">
          <div className="grid gap-6">
            <div className="p-6 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-purple-400" />
                <span className="font-medium text-purple-400">Academic Guidance</span>
              </div>
              <p className="text-white/70 text-sm mb-3">Comprehensive information about FCDS programs, courses, and academic requirements.</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-purple-500/20 text-purple-300 text-xs">Course Selection</Badge>
                <Badge className="bg-purple-500/20 text-purple-300 text-xs">Academic Planning</Badge>
                <Badge className="bg-purple-500/20 text-purple-300 text-xs">Degree Requirements</Badge>
              </div>
            </div>

            <div className="p-6 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-6 h-6 text-purple-400" />
                <span className="font-medium text-purple-400">Career Development</span>
              </div>
              <p className="text-white/70 text-sm mb-3">Easy Material Access, job placement assistance, and career counseling.</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-purple-500/20 text-purple-300 text-xs">Materials</Badge>
                <Badge className="bg-purple-500/20 text-purple-300 text-xs">Job Opportunities</Badge>
                <Badge className="bg-purple-500/20 text-purple-300 text-xs">Career Counseling</Badge>
              </div>
            </div>

            <div className="p-6 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-purple-400" />
                <span className="font-medium text-purple-400">Materials & Grants</span>
              </div>
              <p className="text-white/70 text-sm mb-3">Information about available Materials, grants, and financial aid opportunities.</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-purple-500/20 text-purple-300 text-xs">Local Scholarships</Badge>
                <Badge className="bg-purple-500/20 text-purple-300 text-xs">International Grants</Badge>
                <Badge className="bg-purple-500/20 text-purple-300 text-xs">Research Funding</Badge>
              </div>
            </div>

            <div className="p-6 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-purple-400" />
                <span className="font-medium text-purple-400">AI-Powered Assistance</span>
              </div>
              <p className="text-white/70 text-sm mb-3">Intelligent chatbot (ExploAI) providing instant answers to student queries.</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-purple-500/20 text-purple-300 text-xs">24/7 Support</Badge>
                <Badge className="bg-purple-500/20 text-purple-300 text-xs">Smart Responses</Badge>
                <Badge className="bg-purple-500/20 text-purple-300 text-xs">Personalized Help</Badge>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'features',
      title: 'Platform Features',
      icon: Zap,
      color: 'from-orange-400 to-red-400',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Technical Excellence
            </h4>
            <div className="grid gap-4">
              <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-orange-400 font-medium">Modern Tech Stack</span>
                  <p className="text-white/70 text-sm mt-1">Built with Next.js, TypeScript, and cutting-edge web technologies</p>
                </div>
              </div>
              <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-orange-400 font-medium">Responsive Design</span>
                  <p className="text-white/70 text-sm mt-1">Optimized for all devices - desktop, tablet, and mobile</p>
                </div>
              </div>
              <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-orange-400 font-medium">Fast Performance</span>
                  <p className="text-white/70 text-sm mt-1">Lightning-fast loading with optimized images and code splitting</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security & Privacy
            </h4>
            <div className="grid gap-4">
              <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-orange-400 font-medium">Data Protection</span>
                  <p className="text-white/70 text-sm mt-1">Your privacy is our priority with industry-standard security measures</p>
                </div>
              </div>
              <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-orange-400 font-medium">Secure Authentication</span>
                  <p className="text-white/70 text-sm mt-1">Safe login with Google OAuth and encrypted sessions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'impact',
      title: 'Our Impact',
      icon: TrendingUp,
      color: 'from-cyan-400 to-blue-400',
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <div className="text-3xl font-bold text-cyan-400 mb-2">1000+</div>
              <div className="text-white/80 text-sm">Active Students</div>
              <div className="text-white/60 text-xs mt-1">Helped this semester</div>
            </div>
            <div className="text-center p-6 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <div className="text-3xl font-bold text-cyan-400 mb-2">30000+</div>
              <div className="text-white/80 text-sm">Quiz Solved Last Year</div>
              <div className="text-white/60 text-xs mt-1">Through our platform</div>
            </div>
            <div className="text-center p-6 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <div className="text-3xl font-bold text-cyan-400 mb-2">100+</div>
              <div className="text-white/80 text-sm">Review</div>
              <div className="text-white/60 text-xs mt-1">By our students</div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Success Stories
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-cyan-400 font-bold text-sm">A</span>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm italic">
                      &ldquo;Chameleon FCDS helped me land my dream internship at Google through their career guidance and interview preparation resources.&rdquo;
                    </p>
                    <span className="text-cyan-400 text-xs mt-2 block">- Data Science Student</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-cyan-400 font-bold text-sm">S</span>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm italic">
                      &ldquo;The AI chatbot saved me countless hours by answering my questions instantly. It&apos;s like having a personal academic advisor 24/7.&rdquo;
                    </p>
                    <span className="text-cyan-400 text-xs mt-2 block">- Cybersecurity Student</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'future',
      title: 'Future Roadmap',
      icon: Rocket,
      color: 'from-yellow-400 to-orange-400',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Upcoming Features
            </h4>
            <div className="grid gap-4">
              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="text-yellow-400 font-medium">Virtual Study Groups</span>
                  <p className="text-white/70 text-sm mt-1">Connect with peers for collaborative learning and project work</p>
                </div>
              </div>
              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="text-yellow-400 font-medium">AI-Powered Career Matching</span>
                  <p className="text-white/70 text-sm mt-1">Personalized job and internship recommendations based on your profile</p>
                </div>
              </div>
              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="text-yellow-400 font-medium">Interactive Learning Modules</span>
                  <p className="text-white/70 text-sm mt-1">Gamified learning experiences for complex computer science concepts</p>
                </div>
              </div>
              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="text-yellow-400 font-medium">Industry Partnerships</span>
                  <p className="text-white/70 text-sm mt-1">Direct connections with tech companies for exclusive opportunities</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
            <h4 className="text-lg font-semibold text-yellow-400 flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5" />
              Our Vision for 2025
            </h4>
            <p className="text-white/80">
              By 2025, Chameleon FCDS aims to be the comprehensive digital companion for computer science education, serving students not just at Alexandria University, but across Egypt and the Middle East. We&apos;re committed to continuous innovation and excellence in educational technology.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'contact',
      title: 'Get In Touch',
      icon: Mail,
      color: 'from-pink-400 to-purple-400',
      content: (
        <div className="space-y-6">
          <p className="text-white/80 leading-relaxed">
            Have questions about Chameleon FCDS? Want to contribute to our platform? We&apos;d love to hear from you!
          </p>

          <div className="grid gap-4">
            <div className="p-4 bg-pink-500/10 rounded-lg border border-pink-500/20 flex items-center gap-3">
              <Mail className="w-5 h-5 text-pink-400 flex-shrink-0" />
              <div>
                <span className="text-pink-400 font-medium">Email:</span>
                <span className="text-white/80 ml-2">tokyo9900777@gmail.com</span>
              </div>
            </div>
            <div className="p-4 bg-pink-500/10 rounded-lg border border-pink-500/20 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-pink-400 flex-shrink-0" />
              <div>
                <span className="text-pink-400 font-medium">Location:</span>
                <span className="text-white/80 ml-2">Alexandria University, Faculty of Computer and Data Science - Third Batch</span>
              </div>
            </div>
            <div className="p-4 bg-pink-500/10 rounded-lg border border-pink-500/20 flex items-center gap-3">
              <Globe className="w-5 h-5 text-pink-400 flex-shrink-0" />
              <div>
                <span className="text-pink-400 font-medium">Website:</span>
                <span className="text-white/80 ml-2">https://abdoahmedportfolio.vercel.app/</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
            <Calendar className="w-5 h-5 text-pink-400 flex-shrink-0" />
            <span className="text-white text-sm">
              <strong className='text-pink-400'>Founded:</strong> August 18, 2024 •
              <strong className='text-pink-400'>Last Updated:</strong> September 21, 2025
            </span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] relative overflow-hidden" style={{ fontFamily: 'Rubik, sans-serif' }}>
      <Navigation />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-transparent to-green-500/[0.05] blur-3xl" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{ backgroundImage: 'url(/images/Background.png)' }}
        />

        {/* Floating Icons */}
        <FloatingIcon icon={Heart} className="top-20 left-10" delay={0} />
        <FloatingIcon icon={Sparkles} className="top-40 right-20" delay={1} />
        <FloatingIcon icon={BookOpen} className="bottom-40 left-20" delay={2} />
        <FloatingIcon icon={GraduationCap} className="bottom-20 right-10" delay={3} />
        <FloatingIcon icon={Award} className="top-60 left-1/2" delay={4} />
        <FloatingIcon icon={Zap} className="bottom-60 right-1/3" delay={5} />
      </div>

      <ScrollAnimatedSection className="pt-32 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-4 font-arabic">
                بسم الله الرحمن الرحيم
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <Heart className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-white/60 tracking-wide">About Us</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              About{" "}
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Chameleon FCDS
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-white/60 max-w-3xl mx-auto mb-8"
            >
              <span className="text-blue-400 font-medium">&ldquo;بالعلم نرتقي، وبالإيمان ننتصر، وخدمة المجتمع واجب ديني ووطني&rdquo;</span> - Empowering the next generation of computer scientists and data scientists at Alexandria University through innovative education and community-driven excellence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                Student-Centric
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                Excellence Driven
              </Badge>
            </motion.div>
          </div>

          {/* Table of Contents */}
          <ScrollAnimatedSection className="mb-12">
            <Card className="bg-white/[0.02] border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  Learn More About Us
                </h2>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-3">
                  {sections.map((section, index) => {
                    const IconComponent = section.icon;
                    return (
                      <motion.button
                        key={section.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        onClick={() => {
                          setActiveSection(section.id);
                          document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                          activeSection === section.id
                            ? 'bg-white/10 border border-white/20'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${section.color}`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <span className="text-white font-medium">{section.title}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/40" />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </ScrollAnimatedSection>

          {/* About Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              const isExpanded = expandedSections.has(section.id);

              return (
                <ScrollAnimatedSection key={section.id} animation="slideUp" delay={index * 0.1}>
                  <Card
                    id={section.id}
                    className="bg-white/[0.02] border-white/10 overflow-hidden"
                  >
                    <motion.div
                      className="p-6 cursor-pointer border-b border-white/10"
                      onClick={() => toggleSection(section.id)}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <motion.div
                            className={`p-3 rounded-xl bg-gradient-to-r ${section.color}`}
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <IconComponent className="w-6 h-6 text-white" />
                          </motion.div>
                          <div>
                            <h2 className="text-xl font-semibold text-white">
                              {section.title}
                            </h2>
                            <p className="text-sm text-white/60 mt-1">
                              Click to {isExpanded ? 'collapse' : 'expand'} this section
                            </p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-5 h-5 text-white/60" />
                        </motion.div>
                      </div>
                    </motion.div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <CardContent className="p-6">
                            {section.content}
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </ScrollAnimatedSection>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <ScrollAnimatedSection className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border-blue-500/20">
              <CardContent className="p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Join the Chameleon FCDS Community
                  </h3>
                  <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                    Ready to transform your academic journey? Join thousands of FCDS students who are already benefiting from our platform. Your future in tech starts here.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Start Your Journey
                    </Button>
                    <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white" onClick={() => (window.location.href = 'mailto:tokyo9900777@gmail.com')}>
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Us
                    </Button>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </ScrollAnimatedSection>
        </div>
      </ScrollAnimatedSection>
    </div>
  );
}
