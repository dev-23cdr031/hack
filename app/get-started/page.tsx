"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Compass, Award, ArrowRight, GraduationCap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function GetStartedPage() {
  const userTypes = [
    {
      icon: <GraduationCap className="w-12 h-12 text-blue-400" />,
      title: "Student Login",
      description: "Join hackathons, find teammates, and showcase your skills",
      color: "from-blue-600 to-blue-700",
      hoverColor: "hover:from-blue-700 hover:to-blue-800",
      path: "/auth/student-login"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 md:px-12 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <Image
            src="/hackconnect-logo.svg"
            alt="HackConnect Logo"
            width={40}
            height={40}
            className="rounded-md shadow-[0_0_20px_rgba(99,102,241,0.35)]"
            priority
          />
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            HackConnect
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/">
            <Button
              variant="outline"
              className="bg-transparent border-gray-600 text-white hover:bg-gray-800 transition-all"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              Get Started with HackConnect
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Choose your role to access the platform and start your hackathon journey
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 max-w-md mx-auto">
            {userTypes.map((userType, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <CardHeader className="pb-4 text-center">
                  <div className="mb-6 mx-auto p-4 bg-gray-800/50 rounded-full w-24 h-24 flex items-center justify-center">
                    {userType.icon}
                  </div>
                  <CardTitle className="text-white text-2xl font-bold">{userType.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-400 text-base leading-relaxed mb-8">
                    {userType.description}
                  </CardDescription>
                  <Link href={userType.path}>
                    <Button
                      className={`w-full bg-gradient-to-r ${userType.color} ${userType.hoverColor} text-white py-6 text-lg font-medium transition-all`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Login
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-gray-400 mb-6">
              Don't have an account yet?
            </p>
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold transition-all"
              >
                Create an Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Join <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">HackConnect?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our platform helps students join hackathons, build teams, and showcase projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-800/50">
              <Compass className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Discover Opportunities</h3>
              <p className="text-gray-400">Find hackathons that match your interests and skill level from around the world</p>
            </div>
            <div className="text-center p-6 bg-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-800/50">
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Connect with Others</h3>
              <p className="text-gray-400">Build your network with talented developers and project teammates</p>
            </div>
            <div className="text-center p-6 bg-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-800/50">
              <Award className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Grow Your Skills</h3>
              <p className="text-gray-400">Learn new technologies, gain experience, and enhance your portfolio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gray-900 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} HackConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
