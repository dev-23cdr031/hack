"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import type { Hackathon } from "@/lib/types"
import { HackathonRegistrationForm, RegistrationFormData } from "./hackathon-registration-form"

interface HackathonCardProps {
  hackathon: Hackathon
  onJoin?: (hackathonId: string) => void
  joiningId?: string | null
}

export function HackathonCard({ hackathon, onJoin, joiningId }: HackathonCardProps) {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/20 text-blue-400"
      case "ongoing":
        return "bg-green-500/20 text-green-400"
      case "past":
        return "bg-gray-500/20 text-gray-400"
      default:
        return "bg-blue-500/20 text-blue-400"
    }
  }
  
  const handleOpenRegistration = () => {
    setIsRegistrationOpen(true)
  }
  
  const handleCloseRegistration = () => {
    setIsRegistrationOpen(false)
  }
  
  const handleSubmitRegistration = async (formData: RegistrationFormData) => {
    console.log("Registration form data:", formData)
    
    // Call the original onJoin function with the hackathon ID
    if (onJoin) {
      await onJoin(hackathon.id)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col h-full min-h-[560px]">
      <Link href={`/hackathons/${hackathon.id}`} className="relative block aspect-[16/9] overflow-hidden bg-gray-800">
        <Image
          src={hackathon.image_url || "/coding-hackathon.png"}
          alt={hackathon.title}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />
      </Link>
      <div className="flex items-start justify-between p-5 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
        <h3 className="text-xl font-semibold text-white line-clamp-2 pr-2">{hackathon.title}</h3>
        <Badge className={`${getStatusColor(hackathon.status)} ml-2 whitespace-nowrap`}>{hackathon.status}</Badge>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <p className="text-gray-300 text-sm mb-5 line-clamp-3">{hackathon.description}</p>

        <div className="space-y-4 flex-grow">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <div className="bg-blue-900/30 p-1.5 rounded-md">
                <Calendar className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 text-xs">Start Date</span>
                <span>{formatDate(hackathon.start_date)}</span>
              </div>
            </div>
            
            {hackathon.end_date && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="bg-purple-900/30 p-1.5 rounded-md">
                  <Calendar className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs">End Date</span>
                  <span>{formatDate(hackathon.end_date)}</span>
                </div>
              </div>
            )}
            
            {hackathon.location && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="bg-green-900/30 p-1.5 rounded-md">
                  <MapPin className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs">Location</span>
                  <span className="truncate max-w-[200px]">{hackathon.location}</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <div className="bg-amber-900/30 p-1.5 rounded-md">
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 text-xs">Participants</span>
                <span>{hackathon.current_participants} registered{hackathon.max_participants ? ` / ${hackathon.max_participants} max` : ''}</span>
              </div>
            </div>
            
            {hackathon.prize_amount && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="bg-yellow-900/30 p-1.5 rounded-md">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs">Prize Pool</span>
                  <span className="font-semibold text-yellow-300">${typeof hackathon.prize_amount === 'number' ? hackathon.prize_amount.toLocaleString() : hackathon.prize_amount}</span>
                </div>
              </div>
            )}
          </div>

          {hackathon.themes && hackathon.themes.length > 0 && (
            <div className="mt-4 bg-gray-800/30 p-3 rounded-md border border-gray-700/50">
              <span className="text-gray-300 text-xs font-medium block mb-2">Themes</span>
              <div className="flex flex-wrap gap-2">
                {hackathon.themes.map((theme, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-indigo-900/70 text-indigo-200 hover:bg-indigo-800 border border-indigo-700/50 transition-colors">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-4 bg-gray-800/30 p-3 rounded-md border border-gray-700/50">
            <span className="text-gray-300 text-xs font-medium block mb-2">Event Details</span>
            <div className="grid grid-cols-2 gap-2">
              {hackathon.format && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400 text-xs">Format:</span>
                  <span className="bg-indigo-900/70 px-2 py-0.5 rounded text-xs text-indigo-200 border border-indigo-700/50 font-medium">
                    {hackathon.format === 'competitive' && '🏆 Competitive'}
                    {hackathon.format === 'learning' && '📚 Learning'}
                    {hackathon.format === 'community' && '👥 Community'}
                    {hackathon.format === 'corporate' && '🏢 Corporate'}
                  </span>
                </div>
              )}
              
              {hackathon.type && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400 text-xs">Type:</span>
                  <span className="bg-blue-900/70 px-2 py-0.5 rounded text-xs text-blue-200 border border-blue-700/50 font-medium">
                    {hackathon.type === 'online' && '🌐 Online'}
                    {hackathon.type === 'in-person' && '🏛️ In-Person'}
                    {hackathon.type === 'hybrid' && '🔄 Hybrid'}
                  </span>
                </div>
              )}
              
              {hackathon.skill_level && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400 text-xs">Skill:</span>
                  <span className="bg-green-900/70 px-2 py-0.5 rounded text-xs text-green-200 border border-green-700/50 font-medium">
                    {hackathon.skill_level === 'beginner' && '👶 Beginner'}
                    {hackathon.skill_level === 'intermediate' && '👨‍💻 Intermediate'}
                    {hackathon.skill_level === 'advanced' && '🧙‍♂️ Advanced'}
                    {hackathon.skill_level === 'all-levels' && '👥 All Levels'}
                  </span>
                </div>
              )}
              
              {hackathon.eligibility && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400 text-xs">Eligibility:</span>
                  <span className="bg-purple-900/70 px-2 py-0.5 rounded text-xs text-purple-200 border border-purple-700/50 font-medium">{hackathon.eligibility}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="flex flex-wrap justify-between items-center gap-3">
          {onJoin && (
            <>
              <Button
                onClick={handleOpenRegistration}
                disabled={hackathon.status === 'past' || joiningId === hackathon.id}
                className={`
                  relative overflow-hidden group
                  ${hackathon.status === 'past' || joiningId === hackathon.id 
                    ? 'bg-gray-700 text-gray-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:scale-105 active:scale-95'
                  }
                `}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-30 group-hover:blur-xl transition-all duration-300 rounded-md"></span>
                <span className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 group-hover:opacity-50 blur group-hover:blur-md transition-all duration-300 rounded-md"></span>
                <span className="relative inline-flex items-center">
                  {hackathon.status === 'past' 
                    ? 'Ended' 
                    : (joiningId === hackathon.id 
                      ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Registering...
                        </>
                      ) 
                      : (
                        <>
                          Register Now
                          <svg className="ml-1 -mr-1 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                          </svg>
                        </>
                      )
                    )
                  }
                </span>
              </Button>
              
              {/* Registration Form Modal */}
              <HackathonRegistrationForm
                isOpen={isRegistrationOpen}
                onClose={handleCloseRegistration}
                onSubmit={handleSubmitRegistration}
                hackathonId={hackathon.id}
                hackathonTitle={hackathon.title}
              />
            </>
          )}
          <Link href={`/hackathons/${hackathon.id}`}>
            <Button
              variant="outline"
              className="relative overflow-hidden group border-amber-500 !text-amber-300 hover:!text-amber-200 focus-visible:ring-amber-500 transition-all duration-300 hover:scale-105 active:scale-95 bg-gradient-to-br from-amber-900/70 to-amber-800/70 hover:from-amber-800/80 hover:to-amber-700/80"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-40 transition-opacity duration-300 rounded-md"></span>
              <span className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-30 blur group-hover:blur-sm transition-all duration-300 rounded-md"></span>
              <span className="relative inline-flex items-center font-medium text-amber-200">
                <svg className="mr-1.5 w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Details
                <svg className="ml-1.5 -mr-1 w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </span>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-amber-300 to-yellow-300 group-hover:w-full transition-all duration-300"></span>
              <span className="absolute inset-0 w-full h-full border border-amber-500 rounded-md group-hover:border-amber-400 transition-colors duration-300"></span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
