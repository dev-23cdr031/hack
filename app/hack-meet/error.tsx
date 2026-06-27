'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Video } from 'lucide-react'
import Link from 'next/link'

export default function HackMeetError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <CardTitle>Video Meeting Error</CardTitle>
          </div>
          <CardDescription>
            We encountered a problem with the video meeting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">
              {error.message || "An unexpected error occurred with the video meeting"}
            </p>
            {error.digest && (
              <p className="mt-2 font-mono text-xs text-muted-foreground">Digest: {error.digest}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button onClick={() => reset()} className="w-full">
            Try Again
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/meetings">
              View All Meetings
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}