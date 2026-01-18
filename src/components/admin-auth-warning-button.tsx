"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield } from "lucide-react";
import { motion } from "framer-motion";

interface AdminAuthWarningButtonProps {
  onAuthorize: () => void;
}

export function AdminAuthWarningButton({ onAuthorize }: AdminAuthWarningButtonProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        onClick={onAuthorize}
        className="relative bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105"
        size="sm"
      >
        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-md bg-yellow-400 animate-ping opacity-20"></span>
        
        {/* Content */}
        <span className="relative flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="hidden sm:inline">Authorize Admin Access</span>
          <span className="sm:hidden">Authorize</span>
          <Shield className="w-4 h-4" />
        </span>
      </Button>
    </motion.div>
  );
}
