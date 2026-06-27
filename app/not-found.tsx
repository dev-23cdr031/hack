'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileQuestion className="h-6 w-6 text-amber-500" />
            <CardTitle>Page Not Found</CardTitle>
          </div>
          <CardDescription>
            The page you are looking for doesn't exist or has been moved
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-6xl font-bold mb-4">404</p>
            <p className="text-muted-foreground">
              We couldn't find the page you were looking for.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}