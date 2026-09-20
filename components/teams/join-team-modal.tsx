"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Calendar, 
  Code, 
  MessageSquare,
  Clock,
  ShieldCheck
} from "lucide-react"
import type { Team } from "@/lib/types"

interface JoinTeamModalProps {
  team: Team
  isOpen: boolean
  onClose: () => void
  onJoin: () => Promise<void>
  joining: boolean
}

export function JoinTeamModal({ team, isOpen, onClose, onJoin, joining }: JoinTeamModalProps) {
  const [step, setStep] = useState<'rules' | 'requirements' | 'confirmation'>('rules')
  const [acceptedRules, setAcceptedRules] = useState<string[]>([])
  const [acceptedRequirements, setAcceptedRequirements] = useState(false)
  
  const teamRules = [
    "Be respectful and professional in all team communications",
    "Attend scheduled team meetings whenever possible",
    "Communicate proactively if you can't meet deadlines",
    "Contribute to the team's project according to your role",
    "Share knowledge and help other team members when needed"
  ]
  
  const isRuleAccepted = (rule: string) => acceptedRules.includes(rule)
  
  const toggleRule = (rule: string) => {
    if (isRuleAccepted(rule)) {
      setAcceptedRules(acceptedRules.filter(r => r !== rule))
    } else {
      setAcceptedRules([...acceptedRules, rule])
    }
  }
  
  const allRulesAccepted = teamRules.every(rule => isRuleAccepted(rule))
  
  const handleNext = () => {
    if (step === 'rules' && allRulesAccepted) {
      setStep('requirements')
    } else if (step === 'requirements' && acceptedRequirements) {
      setStep('confirmation')
    }
  }
  
  const handleBack = () => {
    if (step === 'requirements') {
      setStep('rules')
    } else if (step === 'confirmation') {
      setStep('requirements')
    }
  }
  
  const handleClose = () => {
    setStep('rules')
    setAcceptedRules([])
    setAcceptedRequirements(false)
    onClose()
  }
  
  const handleJoin = async () => {
    try {
      await onJoin()
      handleClose()
    } catch (error) {
      console.error("Error joining team:", error)
      // Keep the modal open if there's an error
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full sm:max-w-[550px] bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-600 flex items-center gap-2">
            {step === 'rules' && <BookOpen className="w-5 h-5" />}
            {step === 'requirements' && <ShieldCheck className="w-5 h-5" />}
            {step === 'confirmation' && <CheckCircle2 className="w-5 h-5" />}
            {step === 'rules' && "Team Rules"}
            {step === 'requirements' && "Team Requirements"}
            {step === 'confirmation' && "Confirm Joining"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {step === 'rules' && "Please review and accept the team rules before joining"}
            {step === 'requirements' && "Make sure you can meet these team requirements"}
            {step === 'confirmation' && "You're about to join this team"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {step === 'rules' && (
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700">
                <h3 className="font-medium text-blue-400 mb-1">Joining "{team.name}"</h3>
                <p className="text-sm text-gray-300">Please review and accept all team rules to proceed</p>
              </div>
              
              <div className="space-y-3">
                {teamRules.map((rule, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-md bg-gray-800/30 border border-gray-800">
                    <Checkbox 
                      id={`rule-${index}`} 
                      checked={isRuleAccepted(rule)}
                      onCheckedChange={() => toggleRule(rule)}
                      className="mt-1 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                    />
                    <div className="space-y-1">
                      <label
                        htmlFor={`rule-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {rule}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {step === 'requirements' && (
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700">
                <h3 className="font-medium text-blue-400 mb-1">Team Requirements</h3>
                <p className="text-sm text-gray-300">Make sure you can meet these requirements before joining</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-gray-800/30 border border-gray-800">
                  <h4 className="text-sm font-medium flex items-center gap-2 text-blue-400 mb-3">
                    <Calendar className="w-4 h-4" /> Meeting Schedule
                  </h4>
                  <p className="text-sm text-gray-300">{team.meeting_schedule || "No specific schedule provided"}</p>
                </div>
                
                <div className="p-4 rounded-md bg-gray-800/30 border border-gray-800">
                  <h4 className="text-sm font-medium flex items-center gap-2 text-blue-400 mb-3">
                    <MessageSquare className="w-4 h-4" /> Communication Platform
                  </h4>
                  <p className="text-sm text-gray-300">{team.communication_platform || "Not specified"}</p>
                </div>
                
                <div className="p-4 rounded-md bg-gray-800/30 border border-gray-800">
                  <h4 className="text-sm font-medium flex items-center gap-2 text-blue-400 mb-3">
                    <Code className="w-4 h-4" /> Skills Needed
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {team.skills_needed && team.skills_needed.length > 0 ? (
                      team.skills_needed.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="bg-blue-900/30 text-blue-400 border-blue-800">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-300">No specific skills listed</p>
                    )}
                  </div>
                </div>
                
                <div className="p-4 rounded-md bg-gray-800/30 border border-gray-800">
                  <h4 className="text-sm font-medium flex items-center gap-2 text-blue-400 mb-3">
                    <Clock className="w-4 h-4" /> Time Commitment
                  </h4>
                  <p className="text-sm text-gray-300">
                    This team expects members to contribute regularly throughout the hackathon period.
                  </p>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-md bg-gray-800/30 border border-gray-800">
                  <Checkbox 
                    id="accept-requirements" 
                    checked={acceptedRequirements}
                    onCheckedChange={(checked) => setAcceptedRequirements(checked === true)}
                    className="mt-1 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                  />
                  <div className="space-y-1">
                    <label
                      htmlFor="accept-requirements"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I confirm that I can meet these requirements and commit to this team
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 'confirmation' && (
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-green-400">You're all set!</h3>
                  <p className="text-sm text-gray-300">You've accepted all rules and requirements</p>
                </div>
              </div>
              
              <div className="p-4 rounded-md bg-gray-800/30 border border-gray-800">
                <h4 className="text-sm font-medium text-blue-400 mb-3">Team Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Team Name:</span>
                    <span className="text-sm font-medium text-white">{team.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Current Members:</span>
                    <span className="text-sm font-medium text-white">{team.current_members}/{team.max_members}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Status:</span>
                    <span className="text-sm font-medium text-white capitalize">{team.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Communication:</span>
                    <span className="text-sm font-medium text-white">{team.communication_platform}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-900/20 p-4 rounded-md border border-blue-800/50">
                <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4" /> What happens next?
                </h4>
                <p className="text-sm text-gray-300">
                  After joining, you'll be added to the team's member list. The team leader will reach out to you
                  with next steps and how to connect on {team.communication_platform}.
                </p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          {step !== 'rules' && (
            <Button
              type="button"
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={handleBack}
            >
              Back
            </Button>
          )}
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white w-full sm:w-auto"
              onClick={handleClose}
            >
              Cancel
            </Button>
            
            {step !== 'confirmation' ? (
              <Button
                type="button"
                disabled={step === 'rules' ? !allRulesAccepted : !acceptedRequirements}
                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                onClick={handleNext}
              >
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                disabled={joining}
                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                onClick={handleJoin}
              >
                {joining ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Joining...
                  </>
                ) : (
                  "Join Team"
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}