"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame, Trophy, Zap, Calendar as CalendarIcon, ChevronRight, Github, Code, Coffee, Moon, Sun, Award, Star, Gift } from "lucide-react"

// Mock data for the streak calendar
const generateMockData = () => {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  
  const streakData: Record<string, number> = {}
  
  // Generate last 90 days of data
  for (let i = 0; i < 90; i++) {
    const date = new Date(currentYear, currentMonth, today.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    // Random streak value (0 = no activity, 1-5 = activity level)
    if (i < 7) {
      // Last 7 days have higher chance of activity
      streakData[dateStr] = Math.random() > 0.2 ? Math.floor(Math.random() * 5) + 1 : 0
    } else {
      streakData[dateStr] = Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : 0
    }
  }
  
  return streakData
}

// Achievements data
const achievements = [
  { 
    id: 1, 
    name: "7-Day Streak", 
    description: "Code for 7 consecutive days", 
    icon: Flame, 
    progress: 100, 
    completed: true,
    date: "2023-08-15"
  },
  { 
    id: 2, 
    name: "Night Owl", 
    description: "Code between midnight and 4am", 
    icon: Moon, 
    progress: 100, 
    completed: true,
    date: "2023-08-10"
  },
  { 
    id: 3, 
    name: "Early Bird", 
    description: "Code before 7am for 5 days", 
    icon: Sun, 
    progress: 60, 
    completed: false,
    date: null
  },
  { 
    id: 4, 
    name: "Code Marathon", 
    description: "Code for more than 6 hours in a single day", 
    icon: Zap, 
    progress: 100, 
    completed: true,
    date: "2023-07-28"
  },
  { 
    id: 5, 
    name: "GitHub Master", 
    description: "Make 10 commits in a single day", 
    icon: Github, 
    progress: 70, 
    completed: false,
    date: null
  },
  { 
    id: 6, 
    name: "Caffeine Addict", 
    description: "Code during 3 consecutive weekends", 
    icon: Coffee, 
    progress: 33, 
    completed: false,
    date: null
  },
  { 
    id: 7, 
    name: "30-Day Legend", 
    description: "Maintain a streak for 30 days", 
    icon: Trophy, 
    progress: 43, 
    completed: false,
    date: null
  },
  { 
    id: 8, 
    name: "Language Explorer", 
    description: "Code in 5 different programming languages", 
    icon: Code, 
    progress: 80, 
    completed: false,
    date: null
  },
]

// Rewards data
const rewards = [
  {
    id: 1,
    name: "Premium Theme Pack",
    description: "Unlock exclusive IDE themes",
    cost: 500,
    icon: Palette,
    available: true
  },
  {
    id: 2,
    name: "1-Month Pro Subscription",
    description: "Access to all premium features",
    cost: 1000,
    icon: Award,
    available: true
  },
  {
    id: 3,
    name: "Custom Profile Badge",
    description: "Show off your dedication",
    cost: 750,
    icon: Badge,
    available: true
  },
  {
    id: 4,
    name: "$10 AWS Credits",
    description: "For your cloud projects",
    cost: 1500,
    icon: Cloud,
    available: false
  },
]

// Helper function to calculate streak
const calculateStreak = (data: Record<string, number>) => {
  const sortedDates = Object.keys(data).sort().reverse()
  let currentStreak = 0
  let maxStreak = 0
  let totalDays = 0
  
  for (const date of sortedDates) {
    if (data[date] > 0) {
      currentStreak++
      totalDays++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }
  
  return { currentStreak, maxStreak, totalDays }
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Generate last 30 days for the activity grid
const generateLastThirtyDays = () => {
  const days = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date);
  }
  
  return days;
}

// Missing imports
import { Palette, Cloud } from "lucide-react"

export default function HackStreakPage() {
  const [streakData, setStreakData] = useState<Record<string, number>>({})
  const [stats, setStats] = useState({ currentStreak: 0, maxStreak: 0, totalDays: 0 })
  const [streakPoints, setStreakPoints] = useState(850)
  const [lastThirtyDays, setLastThirtyDays] = useState<Date[]>([])
  
  useEffect(() => {
    // In a real app, you would fetch this data from an API
    const data = generateMockData()
    setStreakData(data)
    setStats(calculateStreak(data))
    setLastThirtyDays(generateLastThirtyDays())
  }, [])
  
  // Function to determine the intensity of the color based on streak value
  const getStreakColor = (value: number) => {
    if (value === 0) return "bg-gray-100 dark:bg-gray-800"
    if (value === 1) return "bg-green-100 dark:bg-green-900/30"
    if (value === 2) return "bg-green-200 dark:bg-green-800/40"
    if (value === 3) return "bg-green-300 dark:bg-green-700/60"
    if (value === 4) return "bg-green-400 dark:bg-green-600/80"
    return "bg-green-500 dark:bg-green-500"
  }
  
  // No longer needed custom day renderer
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600 rounded-lg text-white">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Hack Streak</h1>
              <p className="text-sm text-gray-400">Track your daily coding progress</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" className="text-gray-300">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-600 to-red-600 border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <Flame className="w-5 h-5" />
                Current Streak
              </CardTitle>
              <CardDescription className="text-orange-100">Days in a row</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-white">{stats.currentStreak}</div>
              <div className="text-sm text-orange-100 mt-1">
                {stats.currentStreak > 0 ? "Keep it going!" : "Start coding today!"}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-600 to-blue-600 border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Longest Streak
              </CardTitle>
              <CardDescription className="text-purple-100">Your record</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-white">{stats.maxStreak}</div>
              <div className="text-sm text-purple-100 mt-1">
                {stats.currentStreak >= stats.maxStreak && stats.currentStreak > 0 
                  ? "You're on a roll!" 
                  : "Can you beat it?"}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-600 to-teal-600 border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Streak Points
              </CardTitle>
              <CardDescription className="text-emerald-100">Redeem for rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-white">{streakPoints}</div>
              <div className="text-sm text-emerald-100 mt-1">
                Earn more by maintaining your streak
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="calendar" className="mb-8">
          <TabsList className="bg-gray-800 border border-gray-700">
            <TabsTrigger value="calendar" className="data-[state=active]:bg-gray-700">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-gray-700">
              <Award className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-gray-700">
              <Gift className="w-4 h-4 mr-2" />
              Rewards
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="mt-6">
            <Card className="bg-gray-800/40 border-gray-700">
              <CardHeader>
                <CardTitle>Your Coding Activity</CardTitle>
                <CardDescription className="text-gray-400">
                  Each day shows your coding activity level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="text-sm text-gray-400">Less</div>
                    {[0, 1, 2, 3, 4, 5].map((level) => (
                      <div 
                        key={level} 
                        className={`w-4 h-4 rounded ${getStreakColor(level)}`}
                      />
                    ))}
                    <div className="text-sm text-gray-400">More</div>
                  </div>
                  
                  {/* Activity Grid (Last 30 days) */}
                  <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-300 mb-3">Last 30 Days Activity</h3>
                    <div className="grid grid-cols-7 gap-2">
                      {lastThirtyDays.map((day, index) => {
                        const dateStr = day.toISOString().split('T')[0];
                        const value = streakData[dateStr] || 0;
                        
                        return (
                          <div key={index} className="aspect-square relative group">
                            <div 
                              className={`w-full h-full rounded-md flex items-center justify-center ${getStreakColor(value)}`}
                            >
                              <span className="text-xs">{day.getDate()}</span>
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                              {day.toLocaleDateString()} - {value > 0 ? `${value} activities` : 'No activity'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Total Active Days</div>
                    <div className="text-2xl font-bold">{stats.totalDays}</div>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Weekly Average</div>
                    <div className="text-2xl font-bold">4.2 days</div>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Most Active Day</div>
                    <div className="text-2xl font-bold">Wednesday</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="achievements" className="mt-6">
            <Card className="bg-gray-800/40 border-gray-700">
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription className="text-gray-400">
                  Complete challenges to earn streak points and badges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.id} 
                      className={`border ${achievement.completed ? 'border-green-600/50 bg-green-900/10' : 'border-gray-700 bg-gray-800/40'} rounded-lg p-4 flex items-start gap-4`}
                    >
                      <div className={`p-3 rounded-full ${achievement.completed ? 'bg-green-600/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                        <achievement.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{achievement.name}</div>
                          {achievement.completed && (
                            <Badge variant="outline" className="border-green-600 text-green-400">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">{achievement.description}</div>
                        <div className="mt-3">
                          <Progress value={achievement.progress} className="h-2 bg-gray-700" />
                          <div className="flex items-center justify-between mt-1">
                            <div className="text-xs text-gray-400">{achievement.progress}% complete</div>
                            {achievement.completed && achievement.date && (
                              <div className="text-xs text-gray-400">Earned on {formatDate(achievement.date)}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rewards" className="mt-6">
            <Card className="bg-gray-800/40 border-gray-700">
              <CardHeader>
                <CardTitle>Redeem Rewards</CardTitle>
                <CardDescription className="text-gray-400">
                  Use your streak points to unlock special rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="bg-gray-700/30 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Your Streak Points</div>
                      <div className="text-2xl font-bold">{streakPoints}</div>
                    </div>
                    <Button variant="outline" className="border-gray-600">
                      View History
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rewards.map((reward) => (
                    <div 
                      key={reward.id} 
                      className="border border-gray-700 bg-gray-800/40 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-gray-700 text-gray-300">
                          <reward.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{reward.name}</div>
                          <div className="text-sm text-gray-400 mt-1">{reward.description}</div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="font-medium">{reward.cost} points</span>
                            </div>
                            <Button 
                              variant={streakPoints >= reward.cost && reward.available ? "default" : "outline"} 
                              className={streakPoints >= reward.cost && reward.available ? "bg-orange-600 hover:bg-orange-700" : "border-gray-600 text-gray-400"}
                              disabled={streakPoints < reward.cost || !reward.available}
                            >
                              {streakPoints >= reward.cost && reward.available ? "Redeem" : "Not Available"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-700 pt-4">
                <div className="text-sm text-gray-400">
                  New rewards are added regularly. Keep your streak going to earn more points!
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Tips and Motivation */}
        <Card className="bg-gray-800/40 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle>Streak Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="font-medium mb-2">Set a daily reminder</div>
                <div className="text-sm text-gray-400">
                  Schedule a specific time each day to code and maintain your streak.
                </div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="font-medium mb-2">Start small</div>
                <div className="text-sm text-gray-400">
                  Even 15 minutes of coding counts. Consistency matters more than duration.
                </div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="font-medium mb-2">Join a challenge</div>
                <div className="text-sm text-gray-400">
                  Participate in #100DaysOfCode or other community challenges for motivation.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming Milestones */}
        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle>Your Next Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-orange-600/20 text-orange-400">
                  <Flame className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">10-Day Streak</div>
                  <div className="text-sm text-gray-400">
                    {stats.currentStreak}/10 days completed
                  </div>
                  <Progress value={(stats.currentStreak / 10) * 100} className="h-2 mt-2 bg-gray-700" />
                </div>
                <Button variant="outline" className="border-gray-600">
                  Details <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-600/20 text-purple-400">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Reach 1000 Streak Points</div>
                  <div className="text-sm text-gray-400">
                    {streakPoints}/1000 points earned
                  </div>
                  <Progress value={(streakPoints / 1000) * 100} className="h-2 mt-2 bg-gray-700" />
                </div>
                <Button variant="outline" className="border-gray-600">
                  Details <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-600/20 text-blue-400">
                  <Award className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Complete 5 Achievements</div>
                  <div className="text-sm text-gray-400">
                    {achievements.filter(a => a.completed).length}/5 achievements completed
                  </div>
                  <Progress 
                    value={(achievements.filter(a => a.completed).length / 5) * 100} 
                    className="h-2 mt-2 bg-gray-700" 
                  />
                </div>
                <Button variant="outline" className="border-gray-600">
                  Details <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}