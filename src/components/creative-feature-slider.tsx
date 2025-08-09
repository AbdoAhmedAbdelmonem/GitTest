"use client"

import React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Sparkles, Zap, Target, Rocket, Shield, Crown } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Learning Paths",
    description: "Personalized curriculum that adapts to your learning style and pace",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
    highlight: "Smart & Adaptive",
  },
  {
    icon: Zap,
    title: "Lightning-Fast Progress",
    description: "Accelerated learning with micro-lessons and instant feedback loops",
    gradient: "from-yellow-500 to-orange-500",
    bgGradient: "from-yellow-500/10 to-orange-500/10",
    highlight: "2x Faster Results",
  },
  {
    icon: Target,
    title: "Industry-Focused Content",
    description: "Real-world projects and skills that employers actually want",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    highlight: "Job-Ready Skills",
  },
  {
    icon: Rocket,
    title: "Career Launch Support",
    description: "Dedicated mentorship and job placement assistance",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-500/10 to-emerald-500/10",
    highlight: "95% Job Placement",
  },
  {
    icon: Shield,
    title: "Lifetime Access",
    description: "Keep learning forever with continuous content updates",
    gradient: "from-red-500 to-rose-500",
    bgGradient: "from-red-500/10 to-rose-500/10",
    highlight: "Never Expires",
  },
  {
    icon: Crown,
    title: "Elite Community",
    description: "Connect with top professionals and industry leaders",
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-500/10 to-purple-500/10",
    highlight: "Premium Network",
  },
]

export default function CreativeFeatureSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % features.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [isHovered])

  const currentFeature = features[currentIndex]
  const nextIndex = (currentIndex + 1) % features.length
  const prevIndex = (currentIndex - 1 + features.length) % features.length

  return (
    <section className="py-20 bg-[#030303] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-white/60 tracking-wide">Why You'll Love This</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Experience the{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Difference
            </span>
          </h2>
        </motion.div>

        {/* Main Slider */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-150px" }}
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1 },
          }}
          transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Central Feature Card */}
          <div className="relative h-[400px] md:h-[500px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div
                  className={`relative w-full max-w-2xl h-80 rounded-3xl bg-gradient-to-br ${currentFeature.bgGradient} border border-white/10 backdrop-blur-xl overflow-hidden group`}
                >
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-full h-full">
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-white/20 rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            y: [0, -20, 0],
                            opacity: [0.2, 0.8, 0.2],
                          }}
                          transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: Math.random() * 2,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${currentFeature.gradient} mb-6 shadow-2xl`}
                    >
                      {React.createElement(currentFeature.icon, { className: "w-8 h-8 text-white" })}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mb-4"
                    >
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${currentFeature.gradient} text-white mb-3`}
                      >
                        {currentFeature.highlight}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{currentFeature.title}</h3>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-white/70 text-lg leading-relaxed"
                    >
                      {currentFeature.description}
                    </motion.p>
                  </div>

                  {/* Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${currentFeature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Side Preview Cards */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 hidden lg:block">
            <motion.div
              key={`prev-${prevIndex}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 0.6, x: 0 }}
              className="w-48 h-32 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-4 transform rotate-12 hover:rotate-6 transition-transform duration-300"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-r ${features[prevIndex].gradient} flex items-center justify-center`}
                >
                  {React.createElement(features[prevIndex].icon, { className: "w-4 h-4 text-white" })}
                </div>
                <div>
                  <h4 className="text-white text-sm font-semibold truncate">{features[prevIndex].title}</h4>
                  <p className="text-white/50 text-xs">{features[prevIndex].highlight}</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 hidden lg:block">
            <motion.div
              key={`next-${nextIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 0.6, x: 0 }}
              className="w-48 h-32 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-4 transform -rotate-12 hover:-rotate-6 transition-transform duration-300"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-r ${features[nextIndex].gradient} flex items-center justify-center`}
                >
                  {React.createElement(features[nextIndex].icon, { className: "w-4 h-4 text-white" })}
                </div>
                <div>
                  <h4 className="text-white text-sm font-semibold truncate">{features[nextIndex].title}</h4>
                  <p className="text-white/50 text-xs">{features[nextIndex].highlight}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Progress Indicators */}
        <div className="flex justify-center mt-12 gap-3">
          {features.map((_, index) => (
            <button key={index} onClick={() => setCurrentIndex(index)} className="group relative">
              <div
                className={`w-12 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-white" : "bg-white/20 hover:bg-white/40"
                }`}
              />
              {index === currentIndex && (
                <motion.div
                  layoutId="activeIndicator"
                  className={`absolute inset-0 rounded-full bg-gradient-to-r ${currentFeature.gradient} opacity-50`}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
