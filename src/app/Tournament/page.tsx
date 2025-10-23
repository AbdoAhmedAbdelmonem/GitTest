"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Info, Crown, Star, Timer, Sparkles, Award, Gem, Eye, User } from "lucide-react"
import { useEffect, useState } from "react"
import { getLeaderboardData, LeaderboardEntry } from "@/lib/tournament"
import ScrollAnimatedSection from "@/components/scroll-animated-section"
import Navigation from "@/components/navigation"

const FloatingIcon = ({ icon: Icon, className, delay = 0 }: { icon: React.ComponentType<{ className?: string }>, className?: string, delay?: number }) => {
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
      <Icon className="w-6 h-6 md:w-8 md:h-8 text-yellow-400/20" />
    </motion.div>
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const tournamentEnd = new Date('2026-01-11T23:59:59.999Z');

    const timer = setInterval(() => {
      const now = new Date();
      const difference = tournamentEnd.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-4 md:p-6 backdrop-blur-xl"
    >
        <div className="text-center mb-3 md:mb-4">
          <div className="flex items-center justify-center gap-2 mb-1 md:mb-2">
            <Timer className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
            <span className="text-orange-400 font-semibold text-sm md:text-base">Tournament Ends In</span>
          </div>
          <div className="text-white/60 text-xs md:text-sm">January 11th, 2026</div>
        </div>      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {[
          { value: timeLeft.days, label: 'Days' },
          { value: timeLeft.hours, label: 'Hours' },
          { value: timeLeft.minutes, label: 'Min' },
          { value: timeLeft.seconds, label: 'Sec' }
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg p-2 md:p-3 border border-orange-500/30">
              <div className="text-lg md:text-2xl font-bold text-white">{item.value.toString().padStart(2, '0')}</div>
              <div className="text-xs text-orange-400 font-medium">{item.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Ownership Badge Component
const OwnershipBadge = ({ rank, className }: { rank: number, className?: string }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className={`inline-flex items-center gap-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-full px-2 py-1 ${className}`}
    >
      <User className="w-3 h-3 text-blue-400" />
      <span className="text-blue-400 text-xs font-medium">Your Rank: {rank}</span>
    </motion.div>
  );
};

export default function TournamentPage() {
  const [leaderboardLevel1, setLeaderboardLevel1] = useState<LeaderboardEntry[]>([])
  const [leaderboardLevel2, setLeaderboardLevel2] = useState<LeaderboardEntry[]>([])
  const [currentUserEntry1, setCurrentUserEntry1] = useState<LeaderboardEntry | undefined>()
  const [currentUserEntry2, setCurrentUserEntry2] = useState<LeaderboardEntry | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCurrentUserOnly, setShowCurrentUserOnly] = useState(false)
  const [activeTab, setActiveTab] = useState<"level1" | "level2">("level1")

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true)
        const [level1Data, level2Data] = await Promise.all([
          getLeaderboardData(1),
          getLeaderboardData(2)
        ])

        setLeaderboardLevel1(level1Data.leaderboard)
        setCurrentUserEntry1(level1Data.currentUserEntry)
        setLeaderboardLevel2(level2Data.leaderboard)
        setCurrentUserEntry2(level2Data.currentUserEntry)
      } catch (err) {
        console.error("Error fetching leaderboard:", err)
        setError("Failed to load leaderboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboardData()
  }, [])

  // Get current user's rank based on active tab
  const getCurrentUserRank = (leaderboard: LeaderboardEntry[], currentUserEntry?: LeaderboardEntry) => {
    if (!currentUserEntry) return undefined
    
    // Find the user's position in the full sorted leaderboard
    const userIndex = leaderboard.findIndex(player => player.id === currentUserEntry.id)
    return userIndex !== -1 ? userIndex + 1 : undefined
  }

  const currentUserRank = activeTab === "level1" 
    ? getCurrentUserRank(leaderboardLevel1, currentUserEntry1)
    : getCurrentUserRank(leaderboardLevel2, currentUserEntry2)

  const renderLeaderboard = (data: LeaderboardEntry[], currentUserEntry?: LeaderboardEntry) => {
    if (loading) {
      return (
        <div className="space-y-3 md:space-y-4">
          {[...Array(5)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-white/20 rounded animate-pulse"></div>
                <div className="w-16 md:w-24 h-3 md:h-4 bg-white/20 rounded animate-pulse"></div>
              </div>
              <div className="w-12 md:w-16 h-3 md:h-4 bg-white/20 rounded animate-pulse"></div>
            </motion.div>
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6 md:py-8"
        >
          <p className="text-red-400 text-sm md:text-base">{error}</p>
        </motion.div>
      )
    }

    // If showCurrentUserOnly is true and we have current user data, show only current user
    if (showCurrentUserOnly && currentUserEntry) {
      const actualRank = data.findIndex(player => player.id === currentUserEntry.id) + 1
      return (
        <div className="space-y-3 md:space-y-4">
          <div className="text-center mb-4">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1 text-xs md:text-sm">
              <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              Showing Only Your Rank
            </Badge>
            <p className="text-white/60 text-xs mt-2">Tap the button again to see full leaderboard</p>
          </div>
          {renderLeaderboardItem(currentUserEntry, actualRank - 1, true, actualRank)}
        </div>
      )
    }

    // Get top 10 players
    const topPlayers = data.slice(0, 10)
    
    // Check if current user is in top 10
    const isCurrentUserInTop10 = currentUserEntry && topPlayers.some(player => player.id === currentUserEntry.id)
    
    // Display data: top 10 + current user if not in top 10
    const displayData = currentUserEntry && !isCurrentUserInTop10 
      ? [...topPlayers, currentUserEntry] 
      : [...topPlayers]

    return (
      <div className="space-y-3 md:space-y-4">
        {displayData.map((player, index) => {
          const isCurrentUser = currentUserEntry ? player.id === currentUserEntry.id : false
          // Use array index for ranking display (1st, 2nd, 3rd place effects)
          const displayRank = index + 1
          
          return renderLeaderboardItem(player, index, isCurrentUser, displayRank)
        })}
        
        {/* Show separator if current user is not in top 10 */}
        {currentUserEntry && !isCurrentUserInTop10 && displayData.length > 10 && (
          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative bg-[#030303] px-4">
              <span className="text-white/40 text-xs">... and {data.length - 10} more competitors</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderLeaderboardItem = (player: LeaderboardEntry, index: number, isCurrentUser: boolean, displayRank?: number) => {
    const rank = displayRank || index + 1
    const styling = getPositionStyling(index, isCurrentUser)

    return (
      <motion.div
        key={player.id}
        initial={{ opacity: 0, x: -30, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          type: "spring",
          stiffness: 100
        }}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        className={`relative flex items-center justify-between p-3 md:p-5 rounded-xl border backdrop-blur-xl shadow-lg ${styling.card} ${styling.glow} transition-all duration-300`}
      >
        {/* Ownership Crown for Current User */}
        {isCurrentUser && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
            className="absolute -top-2 -left-2 z-10"
          >
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-1 shadow-lg">
              <Crown className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        )}

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1 md:gap-3">
            {styling.medal && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                className="text-xl md:text-2xl"
              >
                {styling.medal}
              </motion.span>
            )}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
              className={`text-lg md:text-xl font-bold ${styling.rank}`}
            >
              {rank}.
            </motion.span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {player.profile_image ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
                className="relative"
              >
                <Image
                  src={player.profile_image}
                  alt={`${player.name}'s profile`}
                  width={40}
                  height={40}
                  className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-white/20 object-cover shadow-lg"
                />
                {isCurrentUser && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-white"
                  >
                    <User className="w-2 h-2 text-white" />
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
                className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-2 border-white/20 shadow-lg relative"
              >
                <span className="text-white font-bold text-sm md:text-lg">
                  {player.name.charAt(0).toUpperCase()}
                </span>
                {isCurrentUser && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-white"
                  >
                    <User className="w-2 h-2 text-white" />
                  </motion.div>
                )}
              </motion.div>
            )}

            <div className="max-w-[120px] md:max-w-none">
              <div className="flex items-center gap-2">
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className={`${styling.name} text-sm md:text-lg truncate block`}
                  title={player.name || 'Anonymous User'}
                >
                  {player.name || 'Anonymous User'}
                </motion.span>
                {isCurrentUser && (
                  <OwnershipBadge rank={rank} />
                )}
              </div>
              {player.specialization && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                  className="text-xs md:text-sm text-white/60 mt-1 truncate"
                  title={player.specialization}
                >
                  {player.specialization}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 + 0.8, type: "spring" }}
          className="flex items-center gap-1 md:gap-2 text-yellow-400 bg-yellow-500/10 px-2 md:px-4 py-1 md:py-2 rounded-full border border-yellow-500/20"
        >
          <Star className="w-3 h-3 md:w-5 md:h-5" />
          <span className="font-bold text-white text-sm md:text-lg">{player.points}</span>
        </motion.div>
      </motion.div>
    )
  }

  const getPositionStyling = (index: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return {
        card: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400/50 shadow-blue-500/20 relative",
        rank: "text-blue-400",
        name: "text-blue-400 font-semibold",
        medal: "👑",
        glow: "shadow-blue-500/30"
      }
    }

    switch (index) {
      case 0: // 1st place - Gold
        return {
          card: "bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-600/20 border-yellow-400/60 shadow-yellow-500/30",
          rank: "text-yellow-400",
          name: "text-yellow-400 font-bold",
          medal: "🥇",
          glow: "shadow-yellow-500/40"
        }
      case 1: // 2nd place - Silver
        return {
          card: "bg-gradient-to-r from-gray-300/20 via-slate-400/20 to-gray-400/20 border-gray-300/60 shadow-gray-300/30",
          rank: "text-gray-300",
          name: "text-gray-300 font-bold",
          medal: "🥈",
          glow: "shadow-gray-300/40"
        }
      case 2: // 3rd place - Bronze
        return {
          card: "bg-gradient-to-r from-orange-600/20 via-red-600/20 to-orange-700/20 border-orange-500/60 shadow-orange-500/30",
          rank: "text-orange-500",
          name: "text-orange-500 font-bold",
          medal: "🥉",
          glow: "shadow-orange-500/40"
        }
      default: // Other positions - Transparent
        return {
          card: "bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300",
          rank: "text-white/70",
          name: "text-white/80",
          medal: null,
          glow: "hover:shadow-white/20"
        }
    }
  }

  const toggleViewMode = () => {
    setShowCurrentUserOnly(!showCurrentUserOnly)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as "level1" | "level2")
  }

  return (
    <div className="min-h-screen bg-[#030303] relative overflow-hidden">
      {/* Animated Background */}
      <Navigation />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/[0.07] via-transparent to-orange-500/[0.07] blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/[0.05] via-transparent to-pink-500/[0.05] blur-3xl" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{ backgroundImage: 'url(/images/Background.png)' }}
        />
        {/* Floating Trophy Icons */}
        <FloatingIcon icon={Trophy} className="top-10 md:top-20 left-4 md:left-10" delay={0} />
        <FloatingIcon icon={Crown} className="top-20 md:top-40 right-10 md:right-20" delay={1} />
        <FloatingIcon icon={Star} className="bottom-20 md:bottom-40 left-10 md:left-20" delay={2} />
        <FloatingIcon icon={Sparkles} className="bottom-10 md:bottom-20 right-4 md:right-10" delay={3} />
        <FloatingIcon icon={Award} className="top-32 md:top-60 left-1/2" delay={4} />
        <FloatingIcon icon={Gem} className="bottom-32 md:bottom-60 right-1/3" delay={5} />
      </div>
      
      <ScrollAnimatedSection className="pt-24 md:pt-32 pb-12 md:pb-16 relative z-10">
        <div className="container mx-auto px-3 md:px-4">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 rounded-full bg-white/5 border border-white/10 mb-4 md:mb-6"
            >
              <Trophy className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
              <span className="text-xs md:text-sm text-white/60 tracking-wide">Championship Tournament</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl md:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6"
            >
              Ultimate{" "}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Tournament
              </span>
            </motion.h1>

            {/* Your Rank Header */}
            {currentUserRank && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-4 md:mb-6"
              >
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-2xl px-6 py-3 backdrop-blur-sm">
                  <Crown className="w-5 h-5 text-blue-400" />
                  <span className="text-white/80 text-sm md:text-base font-medium">your rank is :</span>
                  <span className="text-blue-400 text-lg md:text-2xl font-bold">{currentUserRank}</span>
                  <span className="text-white/60 text-sm">out of {activeTab === "level1" ? leaderboardLevel1.length : leaderboardLevel2.length} players</span>
                  <User className="w-4 h-4 text-blue-400 ml-1" />
                </div>
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm md:text-lg text-white/60 max-w-3xl mx-auto mb-6 md:mb-8 px-2"
            >
              Compete with the best minds in computer science and data science. Show your skills, climb the leaderboard, and claim victory in this epic battle of knowledge!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-2 md:gap-4"
            >
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm">
                <Crown className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Elite Competition
              </Badge>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm">
                <Timer className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Time Limited
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm">
                <Star className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Prestigious Rewards
              </Badge>
            </motion.div>
          </div>

          {/* Countdown Timer */}
          <ScrollAnimatedSection className="mb-8 md:mb-12">
            <CountdownTimer />
          </ScrollAnimatedSection>

          <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
            {/* Leaderboard Section */}
            <Card className="lg:col-span-2 bg-white/[0.02] border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-b border-white/10 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2 text-lg md:text-2xl">
                      <Trophy className="w-4 h-4 md:w-6 md:h-6 text-yellow-400" />
                      Championship Leaderboard
                    </CardTitle>
                    <CardDescription className="text-white/60 text-sm md:text-base">
                      Battle across levels and claim your throne
                    </CardDescription>
                  </div>
                  
                  {/* Toggle View Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleViewMode}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 ${
                      showCurrentUserOnly 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <Eye className="w-3 h-3 md:w-4 md:h-4" />
                    {showCurrentUserOnly ? 'Show Full Leaderboard' : 'Show My Rank Only'}
                  </motion.button>
                </div>
              </CardHeader>
              <CardContent className="p-3 md:p-6">
                <Tabs defaultValue="level1" className="w-full" onValueChange={handleTabChange}>
                  <TabsList className="grid grid-cols-2 mb-4 md:mb-6 bg-white/10 p-1 rounded-lg">
                    <TabsTrigger
                      value="level1"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-md transition-all duration-300 text-xs md:text-sm px-2 py-1 md:px-4 md:py-2"
                    >
                      <Crown className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      Level 1
                    </TabsTrigger>
                    <TabsTrigger
                      value="level2"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-md transition-all duration-300 text-xs md:text-sm px-2 py-1 md:px-4 md:py-2"
                    >
                      <Star className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      Level 2
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="level1">
                    {renderLeaderboard(leaderboardLevel1, currentUserEntry1)}
                  </TabsContent>
                  <TabsContent value="level2">
                    {renderLeaderboard(leaderboardLevel2, currentUserEntry2)}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Tournament Details */}
            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-white/10 p-4 md:p-6">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-xl">
                  <Info className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                  Tournament Rules
                </CardTitle>
                <CardDescription className="text-white/60 text-sm md:text-base">
                  Master the competition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6 text-white/80 p-3 md:p-6">
                <div className="space-y-3 md:space-y-4">
                  <div className="p-3 md:p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                    <h3 className="font-semibold text-green-400 flex items-center gap-2 mb-1 md:mb-2 text-sm md:text-base">
                      <Crown className="w-3 h-3 md:w-4 md:h-4" /> Victory Rewards
                    </h3>
                    <ul className="text-xs md:text-sm space-y-1">
                      <li>• Win: <span className="text-green-400 font-bold">Chameleon 2026 Ultimate Edition Hoodie</span></li>
                      <li>• Participation: <span className="text-green-400 font-bold">Get Administration Access to full Chameleon 2026</span></li>
                      <li>• Streak: <span className="text-green-400 font-bold">3 Times Streak will win 1000 L.E</span></li>
                    </ul>
                  </div>

                  <div className="p-3 md:p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                    <h3 className="font-semibold text-blue-400 flex items-center gap-2 mb-1 md:mb-2 text-sm md:text-base">
                      <Users className="w-3 h-3 md:w-4 md:h-4" /> Competition Levels
                    </h3>
                    <p className="text-xs md:text-sm">
                      Two separate leaderboards for Level 1 and Level 2 competitors. Points calculated independently.
                    </p>
                  </div>

                  <div className="p-3 md:p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                    <h3 className="font-semibold text-purple-400 flex items-center gap-2 mb-1 md:mb-2 text-sm md:text-base">
                      <Info className="w-3 h-3 md:w-4 md:h-4" /> Tournament Rules
                    </h3>
                    <ul className="text-xs md:text-sm space-y-1">
                      <li>• <span className="text-purple-400 font-semibold">First Attempt Only:</span> Only your first attempt on each quiz counts toward tournament standings</li>
                      <li>• <span className="text-purple-400 font-semibold">Tournament Period:</span> October 11, 2025 - January 11, 2026</li>
                      <li>• Retakes and practice runs won&apos;t affect your tournament score</li>
                      <li>• <span className="text-purple-400 font-semibold">Scoring:</span> Points are reduced (÷10) for balanced competition</li>
                    </ul>
                  </div>

                  <div className="p-3 md:p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
                    <h3 className="font-semibold text-orange-400 flex items-center gap-2 mb-1 md:mb-2 text-sm md:text-base">
                      <Sparkles className="w-3 h-3 md:w-4 md:h-4" /> How We Calculate Your Score?
                    </h3>
                    <div className="text-xs md:text-sm space-y-2">
                      <p className="text-white/90 font-medium mb-1 md:mb-2">Your tournament score is calculated using this formula:</p>
                      <div className="bg-black/20 p-2 md:p-3 rounded border border-white/10">
                        <code className="text-orange-300 text-xs md:text-sm">
                          Total Points = (Correct Answers + Duration + Mode + Completion) ÷ 10
                        </code>
                      </div>
                      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-2 rounded border border-yellow-500/20 mb-2">
                        <p className="text-yellow-400 text-xs font-semibold">⚠️ All points are divided by 10 and rounded for balanced scoring</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 mt-2 md:mt-3">
                        <div>
                          <p className="text-white/80 font-medium mb-1 text-xs md:text-sm">Duration Points:</p>
                          <ul className="text-xs space-y-1 text-white/70">
                            <li>• 1 minute: +5 pts</li>
                            <li>• 5 minutes: +4.5 pts</li>
                            <li>• 15 minutes: +4 pts</li>
                            <li>• 30 minutes: +3.5 pts</li>
                            <li>• 60 minutes: +3 pts</li>
                            <li>• Unlimited: +2.5 pts</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-white/80 font-medium mb-1 text-xs md:text-sm">Mode Points:</p>
                          <ul className="text-xs space-y-1 text-white/70">
                            <li>• Instant Feedback: +1.5 pts</li>
                            <li>• Traditional: +1.2 pts</li>
                          </ul>
                          <p className="text-white/80 font-medium mb-1 mt-1 md:mt-2 text-xs md:text-sm">Completion Points:</p>
                          <ul className="text-xs space-y-1 text-white/70">
                            <li>• Completed: +2 pts</li>
                            <li>• Timed Out: +1.5 pts</li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-white/60 text-xs mt-1 md:mt-2">
                        Higher scores from faster completion and instant mode give you an edge in the tournament!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollAnimatedSection>
    </div>
  )
}
