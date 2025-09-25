"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDynamicMetadata } from '@/lib/dynamic-metadata';
import { pageMetadata } from '@/lib/metadata';
import { 
  FileText, 
  Shield, 
  User, 
  CheckCircle, 
  AlertTriangle, 
  Settings,
  Lock,
  Globe,
  Scale,
  Gavel,
  UserCheck,
  Upload,
  Download,
  Trash2,
  FolderOpen,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ExternalLink,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Star,
  Zap,
  Heart,
  Award,
  Target,
  Briefcase
} from 'lucide-react';
import Navigation from '@/components/navigation';
import ScrollAnimatedSection from '@/components/scroll-animated-section';

interface TermsSection {
  id: string;
  title: string;
  icon: any;
  content: React.ReactNode;
  color: string;
}



const FloatingIcon = ({ icon: Icon, className, delay = 0 }: { icon: any, className?: string, delay?: number }) => {
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
      <Icon className="w-6 h-6 text-purple-400/30" />
    </motion.div>
  );
};

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState<string>('acceptance');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['acceptance']));

  // Dynamic metadata
  useDynamicMetadata({ ...pageMetadata.terms, path: '/terms' });

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const sections: TermsSection[] = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: UserCheck,
      color: 'from-blue-400 to-cyan-400',
      content: (
        <div className="space-y-4">
          <p className="text-white/80 leading-relaxed">
            By accessing and using Drive Manager ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
          </p>
          <div className="flex items-center gap-2 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <span className="text-blue-400 text-sm">Using our service means you agree to these terms</span>
          </div>
        </div>
      )
    },
    {
      id: 'description',
      title: 'Description of Service',
      icon: Target,
      color: 'from-green-400 to-emerald-400',
      content: (
        <div className="space-y-6">
          <p className="text-white/80 leading-relaxed">
            Drive Manager is a web-based application that provides file management capabilities for Google Drive accounts. The Service allows users to:
          </p>
          
          <div className="grid gap-4">
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20 flex items-center gap-3">
              <Upload className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-white/80">Upload files to their Google Drive</span>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20 flex items-center gap-3">
              <Settings className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-white/80">Rename and organize files</span>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20 flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-white/80">Delete files from their Google Drive</span>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20 flex items-center gap-3">
              <FolderOpen className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-white/80">Manage folder structures</span>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20 flex items-center gap-3">
              <FileText className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-white/80">View and organize their existing Drive files</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'accounts',
      title: 'User Accounts & Registration',
      icon: User,
      color: 'from-purple-400 to-pink-400',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Account Creation
            </h4>
            <div className="space-y-3 pl-7">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">You must have a valid Google account to use our Service</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">You are responsible for maintaining the confidentiality of your account</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">You agree to provide accurate and complete information</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Account Responsibilities
            </h4>
            <div className="space-y-3 pl-7">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">You are responsible for all activities that occur under your account</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">You must notify us immediately of any unauthorized use of your account</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">You must not share your account credentials with others</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use',
      icon: CheckCircle,
      color: 'from-orange-400 to-red-400',
      content: (
        <div className="space-y-6">
          <div className="p-6 bg-green-500/10 rounded-lg border border-green-500/30">
            <h4 className="text-lg font-semibold text-green-400 flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5" />
              Permitted Use
            </h4>
            <p className="text-white/80">
              You may use the Service to manage your own Google Drive files in accordance with these terms and Google's Terms of Service.
            </p>
          </div>

          <div className="p-6 bg-red-500/10 rounded-lg border border-red-500/30">
            <h4 className="text-lg font-semibold text-red-400 flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5" />
              Prohibited Activities
            </h4>
            <p className="text-white/80 mb-4">You agree NOT to:</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">Use the Service for any illegal or unauthorized purpose</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">Attempt to gain unauthorized access to other users' accounts or data</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">Upload malicious files or content that violates Google's policies</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">Interfere with or disrupt the Service or servers</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">Use automated tools to access the Service without permission</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">Violate any applicable laws or regulations</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'google-integration',
      title: 'Google Drive Integration',
      icon: Globe,
      color: 'from-cyan-400 to-blue-400',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Authorization
            </h4>
            <div className="space-y-3 pl-7">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">You must explicitly authorize our Service to access your Google Drive</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">You can revoke this authorization at any time through your Google Account settings</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">We only access files and perform operations that you explicitly request</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20 flex items-start gap-3">
            <ExternalLink className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-cyan-400 font-medium">Google Terms:</span>
              <p className="text-white/80 text-sm mt-1">
                Your use of Google Drive through our Service is also governed by Google's Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'liability',
      title: 'Limitations of Liability',
      icon: Scale,
      color: 'from-yellow-400 to-orange-400',
      content: (
        <div className="space-y-6">
          <div className="p-6 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
            <h4 className="text-lg font-semibold text-yellow-400 flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5" />
              Service Limitations
            </h4>
            <p className="text-white/80 font-medium">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Liability Limits
            </h4>
            <div className="space-y-3 pl-7">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">We are not liable for any data loss, corruption, or unauthorized access</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">Our liability is limited to the amount you paid for the Service (if any)</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">We are not responsible for issues arising from Google Drive or Google services</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: Gavel,
      color: 'from-red-400 to-pink-400',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-red-400 flex items-center gap-2">
              <User className="w-5 h-5" />
              Termination by You
            </h4>
            <div className="space-y-3 pl-7">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">You may stop using the Service at any time</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">You can revoke our access to your Google Drive through your Google Account settings</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">You may request deletion of your account data</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-red-400 flex items-center gap-2">
              <Gavel className="w-5 h-5" />
              Termination by Us
            </h4>
            <p className="text-white/80 mb-3">We may terminate or suspend your access if:</p>
            <div className="space-y-3 pl-7">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">You violate these terms</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">You engage in prohibited activities</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">Required by law or regulation</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">For operational or security reasons</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'contact',
      title: 'Contact Information',
      icon: Mail,
      color: 'from-pink-400 to-purple-400',
      content: (
        <div className="space-y-6">
          <p className="text-white/80 leading-relaxed">
            For questions about these Terms of Service, please contact us:
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
                <span className="text-pink-400 font-medium">Address:</span>
                <span className="text-white/80 ml-2">Faculty of Computer and Data Science</span>
              </div>
            </div>
            <div className="p-4 bg-pink-500/10 rounded-lg border border-pink-500/20 flex items-center gap-3">
              <Phone className="w-5 h-5 text-pink-400 flex-shrink-0" />
              <div>
                <span className="text-pink-400 font-medium">Phone:</span>
                <span className="text-white/80 ml-2">+(20)1552828377</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
            <Calendar className="w-5 h-5 text-pink-400 flex-shrink-0" />
            <span className="text-pink-400 text-sm">
              <strong>Last Updated:</strong> September 16, 2025
            </span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] relative overflow-hidden">
      <Navigation />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.05] via-transparent to-pink-500/[0.05] blur-3xl" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{ backgroundImage: 'url(/images/Background.png)' }}
        />
        
        {/* Floating Icons */}
        <FloatingIcon icon={Gavel} className="top-20 left-10" delay={0} />
        <FloatingIcon icon={Scale} className="top-40 right-20" delay={1} />
        <FloatingIcon icon={Shield} className="bottom-40 left-20" delay={2} />
        <FloatingIcon icon={Award} className="bottom-20 right-10" delay={3} />
        <FloatingIcon icon={Briefcase} className="top-60 left-1/2" delay={4} />
        <FloatingIcon icon={Star} className="bottom-60 right-1/3" delay={5} />
      </div>

      <ScrollAnimatedSection className="pt-32 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
            >
              <Gavel className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white/60 tracking-wide">Legal Terms</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Terms of{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Service
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-white/60 max-w-3xl mx-auto mb-8"
            >
              Please read these terms carefully before using Drive Manager. By using our service, you agree to these terms and conditions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
                <Scale className="w-4 h-4 mr-2" />
                Legally Binding
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                User Protection
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                Fair Usage
              </Badge>
            </motion.div>
          </div>

          {/* Table of Contents */}
          <ScrollAnimatedSection className="mb-12">
            <Card className="bg-white/[0.02] border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Table of Contents
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

          {/* Terms Sections */}
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
            <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <CardContent className="p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Questions About Our Terms?
                  </h3>
                  <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                    We're here to help clarify any questions you may have about these terms of service. Our legal team is available to assist you.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Legal Team
                    </Button>
                    <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
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
