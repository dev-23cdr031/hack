"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Users, Shield, Headphones, Code, Rocket } from "lucide-react"
import PaymentModal from "@/components/payment-modal"

export default function ServicesPage() {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{
    type: string
    price: number
    features: string[]
  } | null>(null)

  const handleStartTrial = () => {
    setSelectedPlan({
      type: "pro_trial",
      price: 9,
      features: [
        "7-day free trial",
        "Access to premium hackathons",
        "Advanced team matching",
        "Priority support",
        "Exclusive workshops",
        "Guide connections",
      ],
    })
    setPaymentModalOpen(true)
  }

  const services = [
    {
      icon: <Code className="h-8 w-8" />,
      title: "Hackathon Platform",
      description: "Join exciting hackathons and compete with developers worldwide",
      features: ["Global competitions", "Real-time collaboration", "Project showcase", "Winner recognition"],
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Matching",
      description: "Find the perfect teammates based on skills and interests",
      features: ["AI-powered matching", "Skill-based filtering", "Team formation tools", "Communication hub"],
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Project Incubation",
      description: "Turn your hackathon projects into successful startups",
      features: ["Teammateship programs", "Funding opportunities", "Business guidance", "Market validation"],
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Environment",
      description: "Safe and secure platform for all your development needs",
      features: ["End-to-end encryption", "Secure code repositories", "Privacy protection", "Data backup"],
    },
  ]

  const plans = [
    {
      name: "Free",
      price: 0,
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Access to public hackathons",
        "Basic team matching",
        "Community support",
        "Project portfolio",
        "Basic analytics",
      ],
      popular: false,
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
    },
    {
      name: "Pro",
      price: 29,
      period: "month",
      description: "For serious developers and teams",
      features: [
        "All Free features",
        "Premium hackathons",
        "Advanced team matching",
        "Priority support",
        "Exclusive workshops",
        "Guide connections",
        "Advanced analytics",
        "Custom team branding",
      ],
      popular: true,
      buttonText: "Start Pro Trial",
      buttonVariant: "default" as const,
    },
    {
      name: "Enterprise",
      price: 99,
      period: "month",
      description: "For organizations and large teams",
      features: [
        "All Pro features",
        "Private hackathons",
        "Custom integrations",
        "Dedicated support",
        "Team management tools",
        "Advanced security",
        "Custom branding",
        "API access",
        "White-label solution",
      ],
      popular: false,
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Our Services</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Comprehensive solutions for developers, teams, and organizations to excel in hackathons and beyond
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {services.map((service, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all">
              <CardHeader>
                <div className="text-blue-400 mb-4">{service.icon}</div>
                <CardTitle className="text-white text-xl">{service.title}</CardTitle>
                <CardDescription className="text-slate-300">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-slate-300">
                      <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pricing Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
          <p className="text-xl text-slate-300">
            Select the perfect plan for your needs and start building amazing projects
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative bg-slate-800/50 border-slate-700 ${plan.popular ? "ring-2 ring-blue-500" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-white mb-2">
                  ${plan.price}
                  <span className="text-lg text-slate-400">/{plan.period}</span>
                </div>
                <CardDescription className="text-slate-300">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-slate-300">
                      <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.buttonVariant}
                  className={`w-full ${plan.popular ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" : ""}`}
                  onClick={plan.buttonText === "Start Pro Trial" ? handleStartTrial : undefined}
                >
                  {plan.buttonText === "Start Pro Trial" && <Zap className="mr-2 h-4 w-4" />}
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Highlight */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-white mb-8">Why Choose HackConnect?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Global Community</h4>
              <p className="text-slate-300">Connect with developers from around the world</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Cutting-edge Tools</h4>
              <p className="text-slate-300">Access the latest development tools and technologies</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">24/7 Support</h4>
              <p className="text-slate-300">Get help whenever you need it from our expert team</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          planType={selectedPlan.type}
          planPrice={selectedPlan.price}
          planFeatures={selectedPlan.features}
        />
      )}
    </div>
  )
}
