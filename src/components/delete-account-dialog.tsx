"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, AlertTriangle, Heart, Clock, PartyPopper, Skull } from "lucide-react"
import { useToast } from "@/components/ToastProvider"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface DeleteAccountDialogProps {
  userId: number
  username: string
  quizCount: number
  deletionScheduledAt?: string | null
  onDeletionScheduled?: () => void
  onDeletionCancelled?: () => void
}

// Sarcastic messages for different stages
const SARCASTIC_MESSAGES = {
  initial: [
    "So you want to abandon us? After all we've been through?",
    "Warning: Your data will miss you more than you'll miss it",
    "Your quiz attempts are already crying in anticipation",
  ],
  confirmation: [
    "Fine. We'll wait 14 days. Maybe you'll miss us... probably not, but maybe.",
    "Last chance to back out! Your { quizCount } quizzes are begging for mercy",
    "Type 'DELETE' below to prove you're not just having a bad day",
  ],
  scheduled: [
    "T-minus { days } days until your dramatic exit",
    "Still time to change your mind... just saying",
    "Your account is on death row. Pretty dark, right?",
  ],
  cancelled: [
    "Oh thank goodness! We were getting worried!",
    "We knew you couldn't stay away! Welcome back!",
    "Plot twist: You actually like us! (We like you too)",
  ],
  farewell: [
    "It's been real. It's been fun. It hasn't been real fun. Goodbye.",
    "Don't let the digital door hit you on the way out!",
    "May your future quizzes be forever untracked",
  ]
}

export function DeleteAccountDialog({
  userId,
  username,
  quizCount,
  deletionScheduledAt,
  onDeletionScheduled,
  onDeletionCancelled,
}: DeleteAccountDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"initial" | "confirm" | "scheduled">("initial")
  const [confirmText, setConfirmText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null)
  const { addToast } = useToast()

  // Calculate days remaining if deletion is scheduled
  useEffect(() => {
    if (deletionScheduledAt) {
      const deletionDate = new Date(deletionScheduledAt)
      const now = new Date()
      const diffTime = deletionDate.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setDaysRemaining(diffDays > 0 ? diffDays : 0)
      setStep("scheduled")
    } else {
      setStep("initial")
      setDaysRemaining(null)
    }
  }, [deletionScheduledAt])

  const handleScheduleDeletion = async () => {
    if (confirmText.toUpperCase() !== "DELETE") {
      addToast("Please type DELETE to confirm. We need to know you're serious.", "error")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/delete-account/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error("Failed to schedule deletion")
      }

      const data = await response.json()
      
      addToast(
        SARCASTIC_MESSAGES.farewell[Math.floor(Math.random() * SARCASTIC_MESSAGES.farewell.length)],
        "success"
      )
      
      // Update local state immediately to show countdown
      setStep("scheduled")
      setDaysRemaining(14)
      
      // Close dialog and reload to get fresh data
      setOpen(false)
      onDeletionScheduled?.()
    } catch (error) {
      console.error("Error scheduling deletion:", error)
      addToast("Failed to schedule deletion. The universe wants you to stay!", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelDeletion = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/delete-account/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error("Failed to cancel deletion")
      }

      addToast(
        SARCASTIC_MESSAGES.cancelled[Math.floor(Math.random() * SARCASTIC_MESSAGES.cancelled.length)],
        "success"
      )
      
      setStep("initial")
      setDaysRemaining(null)
      setConfirmText("")
      onDeletionCancelled?.()
      setOpen(false)
    } catch (error) {
      console.error("Error cancelling deletion:", error)
      addToast("Failed to cancel deletion. Please try again!", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const renderInitialStep = () => (
    <>
      <DialogHeader>
        <DialogDescription className="text-white/70 space-y-3">
          <p className="text-lg font-medium text-red-400">
            {SARCASTIC_MESSAGES.initial[0]}
          </p>
          <p>
            Look, we get it. Sometimes you just need to burn it all down and start fresh. 
            But before you go full scorched earth, here's what you'll be losing:
          </p>
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {/* What will be deleted */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-red-400 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Things that will be obliterated:
          </h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <span><strong>{quizCount}</strong> quiz attempts (they had dreams, you know)</span>
            </li>
            <li className="flex items-center gap-2">
              <span>All your notifications (the good ones AND the bad ones)</span>
            </li>
            <li className="flex items-center gap-2">
              <span>Your beloved Chameleon profile (R.I.P. <strong>{username}</strong>)</span>
            </li>
          </ul>
        </div>

        {/* Timer explanation */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-amber-400 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            The 14-Day Cooling Off Period
          </h4>
          <p className="text-sm text-white/70">
            Because we're hopeless romantics, we'll wait 14 days before actually deleting anything. 
            You know, in case you realize you can't live without us. 
            <span className="italic"> (No pressure though... okay maybe a little pressure)</span>
          </p>
        </div>
      </div>

      <DialogFooter className="gap-4 sm:gap-4 flex-col sm:flex-row w-full" style={{justifyContent: "space-between"}}>
        <Button
          variant="outline"
          onClick={() => setOpen(false)}
          className="border-green-500/30 text-white-400 bg-green-500/30 hover:bg-green-500/10 hover:text-white"
        >
          <Heart className="w-4 h-4 mr-2" />
          Nevermind, I love it here!
        </Button>
        <Button
          variant="destructive"
          onClick={() => setStep("confirm")}
          className="bg-red-500 hover:bg-red-600"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          I'm sure, proceed...
        </Button>
      </DialogFooter>
    </>
  )

  const renderConfirmStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-red-500">
          <AlertTriangle className="w-6 h-6 animate-pulse" />
          Last Chance, {username}!
        </DialogTitle>
        <DialogDescription className="text-white/70 space-y-2">
          <p className="text-lg font-medium text-amber-400">
            {SARCASTIC_MESSAGES.confirmation[0].replace("{ quizCount }", String(quizCount))}
          </p>
          <p>
            Okay okay, we believe you. But we need you to prove you're not just having 
            a Monday (even if it's not Monday).
          </p>
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="confirm-delete" className="text-white/80">
            Type <span className="text-red-500 font-bold">DELETE</span> to confirm 
            (all caps, because we're dramatic like that):
          </Label>
          <Input
            id="confirm-delete"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE here..."
            className="bg-white/10 border-red-500/30 text-white placeholder:text-white/40 focus:border-red-500"
          />
        </div>

        <p className="text-xs text-white/50 italic">
          Fun fact: Most people who get this far chicken out. No shame in it!
        </p>
      </div>

      <DialogFooter className="gap-4 sm:gap-4 flex-col sm:flex-row w-full" style={{justifyContent: "space-between"}}>
        <Button
          variant="outline"
          onClick={() => {
            setStep("initial")
            setConfirmText("")
          }}
          className="border-white/20 bg-green-500/30 text-white/70 hover:bg-white/10 hover:text-white"
        >
          Wait, let me reconsider...
        </Button>
        <Button
          variant="destructive"
          onClick={handleScheduleDeletion}
          disabled={isLoading || confirmText.toUpperCase() !== "DELETE"}
          className="bg-red-500 hover:bg-red-600 disabled:opacity-50"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : (
            <Skull className="w-4 h-4 mr-2" />
          )}
          Schedule My Departure
        </Button>
      </DialogFooter>
    </>
  )

  const renderScheduledStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-amber-500">
          <Clock className="w-6 h-6 animate-spin-slow" />
          Countdown Initiated
        </DialogTitle>
        <DialogDescription className="text-white/70 space-y-2">
          <p className="text-2xl font-bold text-red-400">
            {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining
          </p>
          <p className="text-lg">
            {SARCASTIC_MESSAGES.scheduled[1]}
          </p>
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {/* Countdown visual */}
        <div className="bg-gradient-to-r from-red-500/20 to-amber-500/20 border border-red-500/30 rounded-lg p-6 text-center">
          <div className="text-6xl font-bold text-red-400 mb-2">
            {daysRemaining}
          </div>
          <p className="text-white/60">
            days until account deletion
          </p>
          <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500 transition-all duration-500"
              style={{ width: `${((14 - (daysRemaining || 0)) / 14) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-400 text-sm font-medium flex items-center gap-2">
            <PartyPopper className="w-4 h-4" />
            Changed your mind? It's not too late!
          </p>
          <p className="text-white/60 text-xs mt-1">
            Just click the button below and pretend this never happened. We won't judge. 
            <span className="italic">(Okay, maybe we'll judge a little bit)</span>
          </p>
        </div>
      </div>

      <DialogFooter className="gap-4 sm:gap-4 flex-col sm:flex-row w-full" style={{justifyContent: "space-between"}}>
        <Button
          variant="outline"
          onClick={() => setOpen(false)}
          className="border-white/20 text-white/70 bg-black/20 hover:bg-white/10 hover:text-white hover:border-black/20"
        >
          Close
        </Button>
        <Button
          variant="default"
          onClick={handleCancelDeletion}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : (
            <Heart className="w-4 h-4 mr-2" />
          )}
          Cancel Deletion (I'm Back!)
        </Button>
      </DialogFooter>
    </>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50 transition-all duration-300 ${
            deletionScheduledAt ? "animate-pulse" : ""
          }`}
        >
          {deletionScheduledAt ? (
            <>
              <Clock className="w-4 h-4 mr-2" />
              Deletion Scheduled ({daysRemaining} days left)
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete My Account
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a1a2e] border-white/20 text-white max-w-lg">
        {step === "initial" && renderInitialStep()}
        {step === "confirm" && renderConfirmStep()}
        {step === "scheduled" && renderScheduledStep()}
      </DialogContent>
    </Dialog>
  )
}
