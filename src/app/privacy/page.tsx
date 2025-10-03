"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDynamicMetadata } from '@/lib/dynamic-metadata';
import { pageMetadata } from '@/lib/metadata';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Users, 
  Globe, 
  FileText, 
  Settings,
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
  Trash2,
  RefreshCw,
  ArrowRight,
  ChevronDown,
  Star,
  Heart,
  Zap
} from 'lucide-react';
import Navigation from '@/components/navigation';
import ScrollAnimatedSection from '@/components/scroll-animated-section';

interface PolicySection {
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
      <Icon className="w-6 h-6 text-blue-400/30" />
    </motion.div>
  );
};

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState<string>('introduction');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['introduction']));

  // Dynamic metadata
  useDynamicMetadata({ ...pageMetadata.privacy, path: '/privacy' });

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const sections: PolicySection[] = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: Shield,
      color: 'from-blue-400 to-cyan-400',
      content: (
        <div className="space-y-4">
          <p className="text-white/80 leading-relaxed">
            ("we," "our," or "us") provides a file management service and Educational Experience that helps users organize and manage their Study Materials. This Privacy Policy explains how we collect, use, and protect your information when you use our service.
          </p>
          <div className="flex items-center gap-2 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <span className="text-blue-400 text-sm">Your privacy is our top priority</span>
          </div>
        </div>
      )
    },
    {
      id: 'collection',
      title: 'Information We Collect',
      icon: Database,
      color: 'from-green-400 to-emerald-400',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-400 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Google Account Information
            </h4>
            <div className="space-y-3 pl-7">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">Your email address (to identify your account)</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">Your profile information (name and profile picture)</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">Access to your Google Drive files (only when you explicitly use our file management features)</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-400 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Usage Information
            </h4>
            <div className="space-y-3 pl-7">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">Information about how you use our service</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">Error logs and performance data (to improve our service)</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">File operations you perform through our interface</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'usage',
      title: 'How We Use Your Information',
      icon: Settings,
      color: 'from-purple-400 to-pink-400',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Core Functionality
            </h4>
            <div className="grid gap-4">
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <span className="font-medium text-purple-400">File Management</span>
                </div>
                <p className="text-white/70 text-sm">To upload, rename, delete, and organize files in your Google Drive as you request</p>
              </div>
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <span className="font-medium text-purple-400">User Authentication</span>
                </div>
                <p className="text-white/70 text-sm">To identify you and maintain your session and Gain Access tokens in case of you are an Administrator</p>
              </div>
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="font-medium text-purple-400">Account Management</span>
                </div>
                <p className="text-white/70 text-sm">To provide personalized service and associate files with your account</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Service Improvement
            </h4>
            <div className="space-y-3 pl-7">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">To analyze usage patterns and improve our service</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">To debug issues and provide technical support</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">To ensure security and prevent abuse</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sharing',
      title: 'Information Sharing',
      icon: Globe,
      color: 'from-orange-400 to-red-400',
      content: (
        <div className="space-y-6">
          <div className="p-6 bg-green-500/10 rounded-lg border border-green-500/30">
            <h4 className="text-lg font-semibold text-green-400 flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5" />
              We Do NOT:
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">Share your personal information with third parties</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">Sell your data to advertisers or other companies</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">Access your Account without your explicit action</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-orange-500/10 rounded-lg border border-orange-500/30">
            <h4 className="text-lg font-semibold text-orange-400 flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5" />
              We May Share Information:
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">When required by law or legal process</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">To protect our rights, property, or safety</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">With service providers who help us operate our service (under strict confidentiality agreements)</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Data Storage & Security',
      icon: Lock,
      color: 'from-cyan-400 to-blue-400',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Data Storage
            </h4>
            <div className="grid gap-4">
              <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <p className="text-white/80 text-sm">We store minimal account information (email, user ID, authentication tokens) in our secure database</p>
              </div>
              <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <p className="text-white/80 text-sm">Your files remain in your Google Drive - we do not store copies</p>
              </div>
              <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <p className="text-white/80 text-sm">Authentication tokens are encrypted and stored securely</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security Measures
            </h4>
            <div className="space-y-3 pl-7">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">All data transmission is encrypted (HTTPS/SSL)</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">Access tokens are stored with encryption</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">Regular security audits and updates</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">Limited access to user data by authorized personnel only</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'rights',
      title: 'Your Rights & Controls',
      icon: RefreshCw,
      color: 'from-yellow-400 to-orange-400',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Access and Control
            </h4>
            <div className="grid gap-4">
              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm">You can revoke our access to your Google Drive at any time through your Google Account settings or contact us</span>
              </div>
              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 flex items-start gap-3">
                <Trash2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm">You can request deletion of your account data by contacting us</span>
              </div>
              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 flex items-start gap-3">
                <Users className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm">You can update your profile information through the service</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Data Portability
            </h4>
            <div className="space-y-3 pl-7">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">Your files remain in your Google Drive and are always accessible to you</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/80">You can export your data through Google's standard export tools</span>
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
            If you have questions about this Privacy Policy or our data practices, please contact us:
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
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{ backgroundImage: 'url(/images/Background.png)' }}
        />
        
        {/* Floating Icons */}
        <FloatingIcon icon={Shield} className="top-20 left-10" delay={0} />
        <FloatingIcon icon={Lock} className="top-40 right-20" delay={1} />
        <FloatingIcon icon={Database} className="bottom-40 left-20" delay={2} />
        <FloatingIcon icon={Heart} className="bottom-20 right-10" delay={3} />
        <FloatingIcon icon={Star} className="top-60 left-1/2" delay={4} />
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
            >
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/60 tracking-wide">Privacy & Security</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Privacy{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Policy
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-white/60 max-w-3xl mx-auto mb-8"
            >
              Your privacy matters to us. Learn how we collect, use, and protect your information when you use Drive Manager.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                GDPR Compliant
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
                <Lock className="w-4 h-4 mr-2" />
                End-to-End Encrypted
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Zero Data Selling
              </Badge>
            </motion.div>
          </div>

          {/* Table of Contents */}
          <ScrollAnimatedSection className="mb-12">
            <Card className="bg-white/[0.02] border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
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

          {/* Policy Sections */}
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
            <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
              <CardContent className="p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Questions About Our Privacy Policy?
                  </h3>
                  <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                    We're here to help! If you have any questions about how we handle your data or this privacy policy, don't hesitate to reach out.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Privacy Team
                    </Button>
                    <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                      <FileText className="w-4 h-4 mr-2" />
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
