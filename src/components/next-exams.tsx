'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, GraduationCap, AlertCircle, Sparkles, Timer } from 'lucide-react';
import Image from 'next/image';
import examsData from '@/data/final.json';

interface Exam {
  level: string | string[];
  subject: string;
  duration: number;
  start: string;
  end: string;
  instructor: string;
  code: string;
  date: string;
  day: string;
}

const NextExams = () => {
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Convert exam date and time to Date object
  const parseExamDateTime = (exam: Exam): Date => {
    const dateStr = exam.date;
    const timeStr = exam.start;
    
    let dateObj: Date;
    
    if (dateStr.includes('-')) {
      const [day, month, year] = dateStr.split('-');
      dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      dateObj = new Date(dateStr);
    }
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    dateObj.setHours(hours, minutes, 0, 0);
    
    return dateObj;
  };

  // Update upcoming exams
  useEffect(() => {
    const updateExams = () => {
      const now = new Date();
      
      // Filter and sort all upcoming exams
      const allUpcoming = (examsData as Exam[])
        .filter(exam => {
          const examEndTime = parseExamDateTime(exam);
          return examEndTime > now;
        })
        .sort((a, b) => {
          const dateA = parseExamDateTime(a);
          const dateB = parseExamDateTime(b);
          return dateA.getTime() - dateB.getTime();
        });

      // Take first 5 exams
      let upcoming = allUpcoming.slice(0, 5);
      
      // If we have exactly 5 exams, check if there are more exams on the same day as the 5th one
      if (upcoming.length === 5 && allUpcoming.length > 5) {
        const fifthExamDate = parseExamDateTime(upcoming[4]);
        const fifthExamDay = fifthExamDate.toDateString();
        
        // Find all exams starting on the same day as the 5th exam
        const sameDayExams = allUpcoming.filter(exam => {
          const examDate = parseExamDateTime(exam);
          return examDate.toDateString() === fifthExamDay;
        });
        
        // Replace upcoming with all exams up to and including all same-day exams
        const lastIndex = allUpcoming.indexOf(sameDayExams[sameDayExams.length - 1]);
        upcoming = allUpcoming.slice(0, lastIndex + 1);
      }
      
      setUpcomingExams(upcoming);
    };

    updateExams();
  }, [currentTime]);

  // Update current time every second for real-time countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  // Calculate time until exam
  const getTimeUntilExam = (exam: Exam): { days: number; hours: number; minutes: number; seconds: number } => {
    const examStartTime = parseExamDateTime(exam);
    const now = new Date();
    const diff = examStartTime.getTime() - now.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };

  // Get urgency colors
  const getUrgencyColors = (exam: Exam) => {
    const examStartTime = parseExamDateTime(exam);
    const now = new Date();
    const hoursUntil = (examStartTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntil < 24) {
      return {
        bg: 'from-red-500/10 via-pink-500/10 to-orange-500/10',
        border: 'border-red-500/30',
        glow: 'shadow-red-500/20',
        text: 'from-red-400 to-pink-400',
        badge: 'bg-red-500/20 text-red-300 border-red-500/50'
      };
    }
    if (hoursUntil < 72) {
      return {
        bg: 'from-orange-500/10 via-amber-500/10 to-yellow-500/10',
        border: 'border-orange-500/30',
        glow: 'shadow-orange-500/20',
        text: 'from-orange-400 to-amber-400',
        badge: 'bg-orange-500/20 text-orange-300 border-orange-500/50'
      };
    }
    return {
      bg: 'from-blue-500/10 via-purple-500/10 to-indigo-500/10',
      border: 'border-blue-500/30',
      glow: 'shadow-blue-500/20',
      text: 'from-blue-400 to-purple-400',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/50'
    };
  };

  // Format level display
  const formatLevel = (level: string | string[]): string => {
    if (Array.isArray(level)) {
      return level.join(', ');
    }
    return level || 'All';
  };

  if (upcomingExams.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10 border border-emerald-500/30 p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent)]" />
        <div className="relative flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-emerald-500/30 rounded-full animate-pulse" />
            <GraduationCap className="relative w-20 h-20 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
              All Exams Completed! 🎉
            </h3>
            <p className="text-emerald-200/60">
              No upcoming exams scheduled. Enjoy your free time!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 m-8">
      {/* Meme Image */}
      <div className="flex justify-center mb-6">
        <div className="relative p-1 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 animate-pulse">
          <div className="relative w-32 h-32 bg-black/90 rounded-xl overflow-hidden">
            <Image 
              src="/time.png" 
              alt="Time is running!" 
              fill
              className="object-contain drop-shadow-2xl p-2"
            />
          </div>
        </div>
      </div>

      {/* Premium Header */}
      <div className="relative">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-2xl animate-pulse" />
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-fuchsia-500/20 border border-purple-500/30 backdrop-blur-sm">
                <Sparkles className="w-7 h-7 text-purple-300" />
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
                Upcoming Exams 
              </h2>
              <p className="text-sm text-purple-200/60 mt-1">
                {upcomingExams.length} exam{upcomingExams.length > 1 ? 's' : ''} on your schedule (General Department)
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 backdrop-blur-sm">
            <Timer className="w-5 h-5 text-purple-300" />
            <div className="text-right">
              <div className="text-xs text-purple-200/60">Current Time</div>
              <span className="text-sm font-bold text-purple-200">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Exams Grid - Horizontal Scroll for Mobile, Grid for Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {upcomingExams.map((exam, index) => {
          const colors = getUrgencyColors(exam);
          const timeUntil = getTimeUntilExam(exam);
          const isUrgent = timeUntil.days === 0 && timeUntil.hours < 24;

          return (
            <div
              key={`${exam.code}-${index}`}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl ${colors.glow} animate-in fade-in slide-in-from-bottom-4`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Animated Background Effects */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
              
              {/* Glow effect */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-4 space-y-3">
                {/* Header: Level Badge & Urgency */}
                <div className="flex items-start justify-between gap-2">
                  <div className={`px-2 py-1 rounded-lg border ${colors.badge} backdrop-blur-sm font-semibold text-xs`}>
                    Level {formatLevel(exam.level)}
                  </div>
                  
                  {isUrgent && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-500/30 border border-red-500/50 backdrop-blur-sm animate-pulse">
                      <AlertCircle className="w-3 h-3 text-red-300" />
                      <span className="text-xs font-bold text-red-200">URGENT</span>
                    </div>
                  )}
                </div>

                {/* Subject Title */}
                <div>
                  <h3 className={`text-xl font-black leading-tight bg-gradient-to-r ${colors.text} bg-clip-text text-transparent mb-1.5`}>
                    {exam.subject}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <GraduationCap className="w-4 h-4" />
                    <span className="truncate">{exam.instructor}</span>
                  </div>
                </div>

                {/* Countdown Timer - Compact Display */}
                <div className="py-4 px-3 rounded-xl bg-black/20 border border-white/10 backdrop-blur-sm">
                  <div className="text-center space-y-1.5">
                    <div className="text-xs text-white/40 uppercase tracking-wider font-semibold">Time Until Exam</div>
                    <div className="flex items-center justify-center gap-1.5">
                      {timeUntil.days > 0 && (
                        <div className="flex flex-col items-center">
                          <div className={`text-2xl font-black bg-gradient-to-r ${colors.text} bg-clip-text text-transparent`}>
                            {timeUntil.days}
                          </div>
                          <div className="text-xs text-white/40">days</div>
                        </div>
                      )}
                      {(timeUntil.days > 0 || timeUntil.hours > 0) && (
                        <>
                          <div className="text-2xl text-white/20">:</div>
                          <div className="flex flex-col items-center">
                            <div className={`text-2xl font-black bg-gradient-to-r ${colors.text} bg-clip-text text-transparent`}>
                              {timeUntil.hours}
                            </div>
                            <div className="text-xs text-white/40">hours</div>
                          </div>
                        </>
                      )}
                      <div className="text-xl text-white/20">:</div>
                      <div className="flex flex-col items-center">
                        <div className={`text-2xl font-black bg-gradient-to-r ${colors.text} bg-clip-text text-transparent`}>
                          {String(timeUntil.minutes).padStart(2, '0')}
                        </div>
                        <div className="text-xs text-white/40">min</div>
                      </div>
                      <div className="text-xl text-white/20">:</div>
                      <div className="flex flex-col items-center">
                        <div className={`text-2xl font-black bg-gradient-to-r ${colors.text} bg-clip-text text-transparent`}>
                          {String(timeUntil.seconds).padStart(2, '0')}
                        </div>
                        <div className="text-xs text-white/40">sec</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exam Details */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Calendar className="w-4 h-4 text-white/50" />
                    <span className="font-semibold">{exam.date}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/50 capitalize">{exam.day}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Clock className="w-4 h-4 text-white/50" />
                    <span className="font-semibold">{exam.start} - {exam.end}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/50">{exam.duration}h duration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <BookOpen className="w-4 h-4 text-white/50" />
                    <span className="font-mono text-xs text-white/50">{exam.code}</span>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="pt-2">
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${colors.text} rounded-full transition-all duration-1000 ease-out`}
                      style={{
                        width: `${Math.min(100, ((5 - index) / 5) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NextExams;
