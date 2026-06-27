'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
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
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
          <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg border">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold">Critical Error</h1>
            </div>
            <p className="text-muted-foreground mb-6">
              A critical error occurred in the application
            </p>
            <div className="text-sm text-muted-foreground mb-6">
              <p>Error: {error.message || "An unexpected error occurred"}</p>
              {error.digest && (
                <p className="mt-2 font-mono text-xs">Digest: {error.digest}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => reset()}>Try again</Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}