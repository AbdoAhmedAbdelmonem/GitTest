"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalculatorIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const inputOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return firstValue / secondValue
      case "=":
        return secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = Number.parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const clearEntry = () => {
    setDisplay("0")
  }

  const buttons = [
    { label: "C", action: clear, className: "bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30" },
    {
      label: "CE",
      action: clearEntry,
      className: "bg-orange-500/20 border-orange-400/30 text-orange-300 hover:bg-orange-500/30",
    },
    {
      label: "⌫",
      action: () => setDisplay(display.slice(0, -1) || "0"),
      className: "bg-gray-500/20 border-gray-400/30 text-gray-300 hover:bg-gray-500/30",
    },
    {
      label: "÷",
      action: () => inputOperation("÷"),
      className: "bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30",
    },

    {
      label: "7",
      action: () => inputNumber("7"),
      className: "bg-white/5 border-white/15 text-white hover:bg-white/10",
    },
    {
      label: "8",
      action: () => inputNumber("8"),
      className: "bg-white/5 border-white/15 text-white hover:bg-white/10",
    },
    {
      label: "9",
      action: () => inputNumber("9"),
      className: "bg-white/5 border-white/15 text-white hover:bg-white/10",
    },
    {
      label: "×",
      action: () => inputOperation("×"),
      className: "bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30",
    },

    {
      label: "4",
      action: () => inputNumber("4"),
      className: "bg-white/5 border-white/15 text-white hover:bg-white/10",
    },
    {
      label: "5",
      action: () => inputNumber("5"),
      className: "bg-white/5 border-white/15 text-white hover:bg-white/10",
    },
    {
      label: "6",
      action: () => inputNumber("6"),
      className: "bg-white/5 border-white/15 text-white hover:bg-white/10",
    },
    {
      label: "-",
      action: () => inputOperation("-"),
      className: "bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30",
    },

    {
      label: "1",
      action: () => inputNumber("1"),
      className: "bg-white/5 border-white/15 text-white hover:bg-white/10",
    },
    {
      label: "2",
      action: () => inputNumber("2"),
      className: "bg-white/5 border-white/15 text-white hover:bg-white/10",
    },
    {
      label: "3",
      action: () => inputNumber("3"),
      className: "bg-white/5 border-white/15 text-white hover:bg-white/10",
    },
    {
      label: "+",
      action: () => inputOperation("+"),
      className: "bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30",
    },

    {
      label: "0",
      action: () => inputNumber("0"),
      className: "bg-white/5 border-white/15 text-white hover:bg-white/10 col-span-2",
    },
    {
      label: ".",
      action: () => inputNumber("."),
      className: "bg-white/5 border-white/15 text-white hover:bg-white/10",
    },
    {
      label: "=",
      action: performCalculation,
      className: "bg-green-500/20 border-green-400/30 text-green-300 hover:bg-green-500/30",
    },
  ]

  return (
    <div className="h-full flex flex-col">
      <Card className="bg-white/[0.02] border-white/[0.08] backdrop-blur-lg flex-1 flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-3">
            <CalculatorIcon className="w-6 h-6" />
            Calculator
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {/* Display */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/30 rounded-lg p-6 mb-6 border border-white/[0.08]"
          >
            <div className="text-right">
              {operation && previousValue !== null && (
                <div className="text-white/40 text-sm mb-1">
                  {previousValue} {operation}
                </div>
              )}
              <div className="text-white text-3xl font-mono font-bold">{display}</div>
            </div>
          </motion.div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-3 flex-1">
            {buttons.map((button, index) => (
              <motion.div
                key={button.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className={button.label === "0" ? "col-span-2" : ""}
              >
                <Button
                  onClick={button.action}
                  className={cn("w-full h-14 text-lg font-semibold border-2 transition-all", button.className)}
                  variant="outline"
                >
                  {button.label}
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
