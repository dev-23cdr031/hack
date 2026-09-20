"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, Loader2, AlertTriangle } from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  planType: string
  planPrice: number
  planFeatures: string[]
}

export default function PaymentModal({ isOpen, onClose, planType, planPrice, planFeatures }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [transactionId, setTransactionId] = useState("")
  const [error, setError] = useState<string>("")

  const paymentMethods = [
    {
      id: "gpay",
      name: "KEC Pay",
      icon: "🟢",
      description: "Pay with KEC Pay UPI",
      color: "bg-green-100 border-green-300 hover:bg-green-200",
    },
    {
      id: "phonepe",
      name: "PhonePe",
      icon: "🟣",
      description: "Pay with PhonePe UPI",
      color: "bg-purple-100 border-purple-300 hover:bg-purple-200",
    },
    {
      id: "amazonpay",
      name: "Amazon Pay",
      icon: "🟠",
      description: "Pay with Amazon Pay wallet",
      color: "bg-orange-100 border-orange-300 hover:bg-orange-200",
    },
    {
      id: "paytm",
      name: "Paytm",
      icon: "🔵",
      description: "Pay with Paytm wallet",
      color: "bg-blue-100 border-blue-300 hover:bg-blue-200",
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: "💳",
      description: "Pay with card via Razorpay",
      color: "bg-indigo-100 border-indigo-300 hover:bg-indigo-200",
    },
  ]

  const handlePayment = async () => {
    if (!selectedMethod) return

    setIsProcessing(true)
    setError("")

    try {
      // Get current user (mock for demo)
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || '{"id": "demo-user-id"}')

      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          amount: planPrice,
          paymentMethod: selectedMethod,
          planType: planType,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setTransactionId(result.transactionId)
        setPaymentSuccess(true)
      } else {
        if (result.code === "TABLES_NOT_READY") {
          setError("Payment system is initializing. Please try again in a moment or contact support.")
        } else {
          setError(result.error || "Payment failed. Please try again.")
        }
      }
    } catch (error) {
      console.error("Payment error:", error)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const resetModal = () => {
    setSelectedMethod("")
    setIsProcessing(false)
    setPaymentSuccess(false)
    setTransactionId("")
    setError("")
    onClose()
  }

  const initializePaymentSystem = async () => {
    try {
      setIsProcessing(true)
      const response = await fetch("/api/debug/payments", {
        method: "POST",
      })
      const result = await response.json()

      if (result.success) {
        setError("")
        // Retry payment after initialization
        setTimeout(() => {
          setIsProcessing(false)
        }, 1000)
      } else {
        setError("Failed to initialize payment system. Please contact support.")
        setIsProcessing(false)
      }
    } catch (error) {
      setError("Failed to initialize payment system. Please contact support.")
      setIsProcessing(false)
    }
  }

  if (paymentSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={resetModal}>
        <DialogContent className="w-full sm:max-w-md bg-slate-800 border-slate-700">
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
            <p className="text-slate-300 mb-4">Your subscription has been activated</p>
            <div className="bg-slate-700 rounded-lg p-4 mb-4">
              <p className="text-sm text-slate-400">Transaction ID</p>
              <p className="text-white font-mono text-sm">{transactionId}</p>
            </div>
            <Button onClick={resetModal} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-2xl bg-slate-800 border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">Complete Your Purchase</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4 text-slate-400 hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-red-400 font-medium">Payment Error</p>
                <p className="text-red-300 text-sm">{error}</p>
                {error.includes("initializing") && (
                  <Button
                    onClick={initializePaymentSystem}
                    disabled={isProcessing}
                    className="mt-2 bg-red-600 hover:bg-red-700 text-white text-sm"
                    size="sm"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Initializing...
                      </>
                    ) : (
                      "Initialize Payment System"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan Summary */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Plan Summary</h3>
            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-white capitalize">{planType.replace("_", " ")}</h4>
                  <Badge variant="secondary" className="bg-blue-600 text-white">
                    ${planPrice}
                  </Badge>
                </div>
                <ul className="space-y-2">
                  {planFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-slate-300">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Select Payment Method</h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? "ring-2 ring-blue-500 bg-slate-700"
                      : "bg-slate-700 hover:bg-slate-600"
                  } border-slate-600`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{method.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{method.name}</h4>
                        <p className="text-sm text-slate-400">{method.description}</p>
                      </div>
                      {selectedMethod === method.id && <CheckCircle className="h-5 w-5 text-blue-500" />}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              onClick={handlePayment}
              disabled={!selectedMethod || isProcessing}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${planPrice}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
