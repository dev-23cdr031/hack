"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export function MeetingFallback() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Hack Meet</h1>
      
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <CardTitle>Meeting Service Unavailable</CardTitle>
            </div>
            <CardDescription>
              The meeting service is currently being set up
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              We're setting up the meeting service for the first time. This might take a few moments.
              Please try again in a few seconds.
            </p>
            <p className="text-sm text-gray-500">
              If this issue persists, please contact support.
            </p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button asChild>
              <Link href="/">Go to Home</Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}