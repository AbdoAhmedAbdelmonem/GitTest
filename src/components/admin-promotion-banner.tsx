"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, X, ExternalLink, Shield } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/client";
import { getStudentSession } from "@/lib/auth";

interface AdminPromotionBannerProps {
  onDismiss?: () => void;
}

export function AdminPromotionBanner({ onDismiss }: AdminPromotionBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [notificationId, setNotificationId] = useState<number | null>(null);

  useEffect(() => {
    checkForAdminPromotion();
  }, []);

  const checkForAdminPromotion = async () => {
    try {
      const session = await getStudentSession();
      if (!session) return;

      const supabase = createBrowserClient();

      // Check for unread admin promotion notification
      const { data: notifications, error } = await supabase
        .from("Notifications")
        .select("*")
        .eq("user_id", session.user_id)
        .eq("provider", "admin_promotion")
        .eq("seen", "false")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching admin promotion notification:", error);
        return;
      }

      if (notifications && notifications.length > 0) {
        setNotificationId(notifications[0].id);
        setShowBanner(true);
      }
    } catch (error) {
      console.error("Error checking admin promotion:", error);
    }
  };

  const handleAuthorize = async () => {
    try {
      setIsAuthorizing(true);
      const session = await getStudentSession();
      if (!session) {
        alert("Please log in to authorize your Google account");
        return;
      }

      // Redirect to Google OAuth authorization
      window.location.href = `/api/google-drive/auth?userId=${session.user_id}`;
    } catch (error) {
      console.error("Error starting OAuth flow:", error);
      alert("Failed to start authorization. Please try again.");
      setIsAuthorizing(false);
    }
  };

  const handleDismiss = async () => {
    if (notificationId) {
      try {
        const supabase = createBrowserClient();
        
        // Mark notification as read
        await supabase
          .from("Notifications")
          .update({ seen: "true" })
          .eq("id", notificationId);

        setShowBanner(false);
        onDismiss?.();
      } catch (error) {
        console.error("Error dismissing notification:", error);
      }
    }
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 left-0 right-0 z-50 px-4 pointer-events-none"
        >
          <div className="container mx-auto max-w-4xl pointer-events-auto">
            <Card className="relative bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-orange-500/20 border-2 border-yellow-500/50 backdrop-blur-lg shadow-2xl overflow-hidden">
              {/* Animated background sparkles */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-full h-full">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="relative p-6">
                <button
                  onClick={handleDismiss}
                  className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-start gap-4 pr-8">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <motion.div
                      animate={{
                        rotate: [0, -10, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                      className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Crown className="w-8 h-8 text-yellow-900" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-2xl font-bold text-white mb-2 flex items-center gap-2"
                    >
                      <span className="bg-gradient-to-r from-yellow-200 to-amber-300 bg-clip-text text-transparent">
                        Admin Promotion!
                      </span>
                      <Crown className="w-6 h-6 text-yellow-400" />
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-white/90 mb-4 leading-relaxed"
                    >
                      Congratulations! You have been promoted to{" "}
                      <span className="font-semibold text-yellow-300">
                        Administrator
                      </span>
                      . To access admin features and Google Drive management,
                      please authorize your Google account.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap items-center gap-3"
                    >
                      <Button
                        onClick={handleAuthorize}
                        disabled={isAuthorizing}
                        className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAuthorizing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Redirecting...
                          </>
                        ) : (
                          <>
                            <Shield className="w-4 h-4 mr-2" />
                            Authorize Google Account
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={handleDismiss}
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                      >
                        I'll do this later
                      </Button>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-white/60 text-sm mt-3"
                    >
                      💡 You'll need to authorize once to gain full admin access
                    </motion.p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
