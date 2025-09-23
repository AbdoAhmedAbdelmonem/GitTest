"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Trophy,
  Award,
  Star,
  Crown,
  Diamond,
  Target,
  CheckCircle,
  Lock,
  Sparkles,
  BookOpen,
  GraduationCap,
  Medal,
  Shield,
  Flame,
  ArrowRight,
  ChevronDown,
  TrendingUp,
  LucideIcon
} from 'lucide-react';
import Navigation from '@/components/navigation';
import ScrollAnimatedSection from '@/components/scroll-animated-section';
import Image from 'next/image';

interface CertificationTier {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  requirements: string[];
  benefits: string[];
  unlocked: boolean;
  progress: number;
  totalRequired: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  requirement: string;
  points: number;
  unlocked: boolean;
  tier: string;
}

const FloatingIcon = ({ icon: Icon, className, delay = 0 }: { icon: LucideIcon, className?: string, delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: [0.2, 0.6, 0.2],
        y: [0, -15, 0],
        rotate: [0, 8, -8, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
      className={`absolute ${className}`}
    >
      <Icon className="w-8 h-8 text-yellow-400/20" />
    </motion.div>
  );
};

const CertificationCard = ({ tier, index }: { tier: CertificationTier, index: number }) => {
  const IconComponent = tier.icon;

  return (
    <ScrollAnimatedSection animation="slideUp" delay={index * 0.2}>
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <Card className={`bg-gradient-to-br ${tier.bgColor} border-2 ${tier.borderColor} overflow-hidden relative`}>
          {/* Glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-r ${tier.glowColor} opacity-20 blur-xl`} />

          <div className="relative z-10 p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${tier.color} mb-4 shadow-lg`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <IconComponent className="w-10 h-10 text-white" />
              </motion.div>

              <h3 className={`text-2xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent mb-2`}>
                {tier.name}
              </h3>

              <div className="flex items-center justify-center gap-2 mb-4">
                {tier.unlocked ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Unlocked
                  </Badge>
                ) : (
                  <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                    <Lock className="w-3 h-3 mr-1" />
                    Locked
                  </Badge>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                <motion.div
                  className={`h-2 rounded-full bg-gradient-to-r ${tier.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(tier.progress / tier.totalRequired) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
              <p className="text-white/60 text-sm">
                {tier.progress} / {tier.totalRequired} achievements
              </p>
            </div>

            {/* Requirements */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-white/80" />
                Requirements
              </h4>
              <div className="space-y-2">
                {tier.requirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-white/80 text-sm">
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full flex-shrink-0" />
                    {req}
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white/80" />
                Benefits
              </h4>
              <div className="space-y-2">
                {tier.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-white/80 text-sm">
                    <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button
                className={`bg-gradient-to-r ${tier.color} hover:opacity-90 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 ${
                  !tier.unlocked ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!tier.unlocked}
              >
                {tier.unlocked ? 'View Certificate' : 'Locked'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </ScrollAnimatedSection>
  );
};

const AchievementItem = ({ achievement, index }: { achievement: Achievement, index: number }) => {

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-lg border transition-all duration-200 ${
        achievement.unlocked
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-white/5 border-white/10'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${
          achievement.unlocked
            ? 'bg-green-500/20'
            : 'bg-gray-500/20'
        }`}>
          {achievement.unlocked ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <Lock className="w-5 h-5 text-gray-400" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-semibold ${
              achievement.unlocked ? 'text-green-400' : 'text-white/80'
            }`}>
              {achievement.title}
            </h4>
            <Badge className={`text-xs ${
              achievement.tier === 'silver' ? 'bg-gray-500/20 text-gray-400' :
              achievement.tier === 'gold' ? 'bg-yellow-500/20 text-yellow-400' :
              achievement.tier === 'platinum' ? 'bg-blue-500/20 text-blue-400' :
              'bg-purple-500/20 text-purple-400'
            }`}>
              {achievement.tier}
            </Badge>
          </div>

          <p className="text-white/60 text-sm mb-2">{achievement.description}</p>
          <p className="text-white/40 text-xs">{achievement.requirement}</p>

          <div className="flex items-center justify-between mt-3">
            <span className="text-white/60 text-xs">
              {achievement.points} points
            </span>
            {achievement.unlocked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-400 text-xs font-medium"
              >
                ✓ Completed
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function CertificationsPage() {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const certificationTiers: CertificationTier[] = [
    {
      id: 'silver',
      name: 'Silver Scholar',
      icon: Medal,
      color: 'from-gray-400 to-gray-600',
      bgColor: 'from-gray-900/50 to-gray-800/30',
      borderColor: 'border-gray-500/50',
      glowColor: 'from-gray-400/20 to-gray-600/20',
      requirements: [
        'Solve 50 quizzes',
        'Complete 10 different subjects',
        'Maintain 70% average score'
      ],
      benefits: [
        'Silver certificate badge',
        'Access to exclusive study materials',
        'Priority in leaderboard rankings',
        'Monthly progress reports'
      ],
      unlocked: true,
      progress: 45,
      totalRequired: 50
    },
    {
      id: 'gold',
      name: 'Golden Genius',
      icon: Crown,
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'from-yellow-900/50 to-orange-800/30',
      borderColor: 'border-yellow-500/50',
      glowColor: 'from-yellow-400/20 to-orange-500/20',
      requirements: [
        'Solve 200 quizzes',
        'Achieve 85% average score',
        'Complete all subjects',
        'Help 5 fellow students'
      ],
      benefits: [
        'Gold certificate with hologram effect',
        'VIP access to premium content',
        'Mentorship opportunities',
        'Exclusive webinars and workshops',
        'Custom study plan recommendations'
      ],
      unlocked: false,
      progress: 120,
      totalRequired: 200
    },
    {
      id: 'platinum',
      name: 'Platinum Prodigy',
      icon: Star,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-900/50 to-indigo-800/30',
      borderColor: 'border-blue-500/50',
      glowColor: 'from-blue-400/20 to-indigo-500/20',
      requirements: [
        'Solve 500 quizzes',
        'Achieve 95% average score',
        'Perfect scores in 50 quizzes',
        'Contribute 20 study materials',
        'Mentor 10 students'
      ],
      benefits: [
        'Platinum certificate with 3D effects',
        'Lifetime premium access',
        'Direct access to faculty',
        'Research opportunities',
        'Certificate of excellence',
        'Professional networking events'
      ],
      unlocked: false,
      progress: 280,
      totalRequired: 500
    },
    {
      id: 'diamond',
      name: 'Diamond Legend',
      icon: Diamond,
      color: 'from-purple-400 to-pink-600',
      bgColor: 'from-purple-900/50 to-pink-800/30',
      borderColor: 'border-purple-500/50',
      glowColor: 'from-purple-400/20 to-pink-500/20',
      requirements: [
        'Solve 1000 quizzes',
        'Perfect scores in 200 quizzes',
        '100% completion rate',
        'Lead 50 study groups',
        'Publish 10 research papers',
        'Win 5 tournaments'
      ],
      benefits: [
        'Diamond certificate with AR effects',
        'Legendary status recognition',
        'Personal academic advisor',
        'International conference invitations',
        'Scholarship opportunities',
        'Hall of fame induction',
        'Lifetime achievement award'
      ],
      unlocked: false,
      progress: 650,
      totalRequired: 1000
    }
  ];

  const achievements: Achievement[] = [
    {
      id: 'first-quiz',
      title: 'Quiz Beginner',
      description: 'Complete your first quiz',
      icon: BookOpen,
      requirement: 'Solve 1 quiz',
      points: 10,
      unlocked: true,
      tier: 'silver'
    },
    {
      id: 'quiz-master-50',
      title: 'Quiz Master',
      description: 'Solve 50 quizzes',
      icon: Target,
      requirement: 'Solve 50 quizzes',
      points: 100,
      unlocked: true,
      tier: 'silver'
    },
    {
      id: 'perfect-score',
      title: 'Perfect Score',
      description: 'Get 100% in any quiz',
      icon: Star,
      requirement: 'Score 100% in 1 quiz',
      points: 50,
      unlocked: true,
      tier: 'gold'
    },
    {
      id: 'quiz-master-200',
      title: 'Advanced Scholar',
      description: 'Solve 200 quizzes',
      icon: GraduationCap,
      requirement: 'Solve 200 quizzes',
      points: 300,
      unlocked: false,
      tier: 'gold'
    },
    {
      id: 'perfect-50',
      title: 'Perfectionist',
      description: 'Get perfect scores in 50 quizzes',
      icon: Crown,
      requirement: 'Score 100% in 50 quizzes',
      points: 500,
      unlocked: false,
      tier: 'platinum'
    },
    {
      id: 'quiz-legend',
      title: 'Quiz Legend',
      description: 'Solve 1000 quizzes',
      icon: Trophy,
      requirement: 'Solve 1000 quizzes',
      points: 1000,
      unlocked: false,
      tier: 'diamond'
    }
  ];

  const sections = [
    {
      id: 'overview',
      title: 'Certification Overview',
      icon: Trophy,
      color: 'from-yellow-400 to-orange-400',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 p-1 mb-6">
              <div className="w-full h-full rounded-full bg-[#030303] flex items-center justify-center">
                <Image
                  src="/images/1212-removebg-preview.png"
                  alt="Chameleon FCDS Logo"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <p className="text-white/80 leading-relaxed text-center text-lg">
            <strong className="text-yellow-400">Chameleon FCDS Certifications</strong> recognize your academic excellence and dedication to learning. Unlock prestigious certificates by achieving milestones in your educational journey.
          </p>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-500/10 rounded-lg border border-gray-500/20">
              <Medal className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-400">50</div>
              <div className="text-white/60 text-sm">Silver</div>
            </div>
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-400">200</div>
              <div className="text-white/60 text-sm">Gold</div>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Star className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">500</div>
              <div className="text-white/60 text-sm">Platinum</div>
            </div>
            <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Diamond className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">1000</div>
              <div className="text-white/60 text-sm">Diamond</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tiers',
      title: 'Certification Tiers',
      icon: Award,
      color: 'from-purple-400 to-pink-400',
      content: (
        <div className="space-y-8">
          <p className="text-white/80 text-center mb-8">
            Four prestigious certification tiers await your academic achievements. Each tier represents a milestone in your educational journey.
          </p>

          <div className="grid gap-8">
            {certificationTiers.map((tier, index) => (
              <CertificationCard key={tier.id} tier={tier} index={index} />
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'achievements',
      title: 'Achievement Challenges',
      icon: Target,
      color: 'from-green-400 to-emerald-400',
      content: (
        <div className="space-y-6">
          <p className="text-white/80 text-center mb-8">
            Complete these challenges to unlock certifications and earn recognition for your academic excellence.
          </p>

          <div className="grid gap-4">
            {achievements.map((achievement, index) => (
              <AchievementItem key={achievement.id} achievement={achievement} index={index} />
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'preview',
      title: 'Certificate Preview',
      icon: Shield,
      color: 'from-cyan-400 to-blue-400',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Certificate Design Preview</h3>
            <p className="text-white/60">See how your certificates will look when you unlock them</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Silver Certificate Preview */}
            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-500/50 overflow-hidden">
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-gray-400 to-gray-600 p-1 mb-4">
                  <div className="w-full h-full rounded-full bg-[#030303] flex items-center justify-center">
                    <Medal className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-400 mb-2">Silver Scholar Certificate</h4>
                <p className="text-white/60 text-sm mb-4">Awarded to [Student Name] for outstanding academic achievement</p>
                <div className="border-t border-gray-500/30 pt-4">
                  <p className="text-white/40 text-xs">Chameleon FCDS • September 2025</p>
                </div>
              </div>
            </Card>

            {/* Gold Certificate Preview */}
            <Card className="bg-gradient-to-br from-yellow-900/50 to-orange-800/30 border border-yellow-500/50 overflow-hidden">
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 p-1 mb-4">
                  <div className="w-full h-full rounded-full bg-[#030303] flex items-center justify-center">
                    <Crown className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-yellow-400 mb-2">Golden Genius Certificate</h4>
                <p className="text-white/60 text-sm mb-4">Awarded to [Student Name] for exceptional academic excellence</p>
                <div className="border-t border-yellow-500/30 pt-4">
                  <p className="text-white/40 text-xs">Chameleon FCDS • September 2025</p>
                </div>
              </div>
            </Card>

            {/* Platinum Certificate Preview */}
            <Card className="bg-gradient-to-br from-blue-900/50 to-indigo-800/30 border border-blue-500/50 overflow-hidden">
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-400 to-blue-600 p-1 mb-4">
                  <div className="w-full h-full rounded-full bg-[#030303] flex items-center justify-center">
                    <Star className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-blue-400 mb-2">Platinum Prodigy Certificate</h4>
                <p className="text-white/60 text-sm mb-4">Awarded to [Student Name] for extraordinary academic achievement</p>
                <div className="border-t border-blue-500/30 pt-4">
                  <p className="text-white/40 text-xs">Chameleon FCDS • September 2025</p>
                </div>
              </div>
            </Card>

            {/* Diamond Certificate Preview */}
            <Card className="bg-gradient-to-br from-purple-900/50 to-pink-800/30 border border-purple-500/50 overflow-hidden">
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-pink-600 p-1 mb-4">
                  <div className="w-full h-full rounded-full bg-[#030303] flex items-center justify-center">
                    <Diamond className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-purple-400 mb-2">Diamond Legend Certificate</h4>
                <p className="text-white/60 text-sm mb-4">Awarded to [Student Name] for legendary academic excellence</p>
                <div className="border-t border-purple-500/30 pt-4">
                  <p className="text-white/40 text-xs">Chameleon FCDS • September 2025</p>
                </div>
              </div>
            </Card>
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
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/[0.05] via-transparent to-purple-500/[0.05] blur-3xl" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{ backgroundImage: 'url(/images/Background.png)' }}
        />

        {/* Floating Icons */}
        <FloatingIcon icon={Trophy} className="top-20 left-10" delay={0} />
        <FloatingIcon icon={Star} className="top-40 right-20" delay={1} />
        <FloatingIcon icon={Crown} className="bottom-40 left-20" delay={2} />
        <FloatingIcon icon={Medal} className="bottom-20 right-10" delay={3} />
        <FloatingIcon icon={Diamond} className="top-60 left-1/2" delay={4} />
        <FloatingIcon icon={Award} className="bottom-60 right-1/3" delay={5} />
        <FloatingIcon icon={Sparkles} className="top-80 right-1/4" delay={6} />
        <FloatingIcon icon={Flame} className="bottom-80 left-1/3" delay={7} />
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white/60 tracking-wide">Academic Excellence</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              <span className="bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Certifications
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-white/60 max-w-3xl mx-auto mb-8"
            >
              Unlock prestigious certifications that showcase your academic achievements and dedication to excellence in computer science and data science education.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Medal className="w-4 h-4 mr-2" />
                Silver Scholar
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-4 py-2">
                <Crown className="w-4 h-4 mr-2" />
                Golden Genius
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                Platinum Prodigy
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
                <Diamond className="w-4 h-4 mr-2" />
                Diamond Legend
              </Badge>
            </motion.div>
          </div>

          {/* Table of Contents */}
          <ScrollAnimatedSection className="mb-12">
            <Card className="bg-white/[0.02] border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Certification Journey
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

          {/* Certification Sections */}
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
            <Card className="bg-gradient-to-r from-yellow-500/10 via-purple-500/10 to-pink-500/10 border-yellow-500/20">
              <CardContent className="p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Start Your Certification Journey
                  </h3>
                  <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                    Begin solving quizzes and achieving milestones to unlock your first certification. Every quiz brings you closer to academic excellence.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button className="bg-gradient-to-r from-yellow-500 to-purple-500 hover:from-yellow-600 hover:to-purple-600 text-white">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Start Learning
                    </Button>
                    <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Progress
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