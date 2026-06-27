'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function DebugPage() {
  const [healthStatus, setHealthStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [dbContent, setDbContent] = useState<any>(null)

  const [seedResult, setSeedResult] = useState<any>(null)
  const [seeding, setSeeding] = useState(false)

  const checkHealth = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setHealthStatus({ ...data, httpStatus: response.status })
    } catch (error) {
      setHealthStatus({
        status: 'error',
        message: 'Failed to reach health endpoint',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  const testHackathonsAPI = async () => {
    try {
      const response = await fetch('/api/hackathons')
      const text = await response.text()
      console.log('Raw response:', text)
      
      try {
        const json = JSON.parse(text)
        console.log('Parsed JSON:', json)
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        console.log('Response was not valid JSON:', text.substring(0, 200))
      }
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  const checkDatabaseContent = async () => {
    try {
      const response = await fetch('/api/debug/database')
      const data = await response.json()
      setDbContent(data)
    } catch (error) {
      setDbContent({
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  const seedDatabase = async () => {
    setSeeding(true)
    try {
      const response = await fetch('/api/debug/seed', {
        method: 'POST'
      })
      const data = await response.json()
      setSeedResult(data)
    } catch (error) {
      setSeedResult({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Dashboard</h1>
        
        <div className="grid gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>System Health Check</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={checkHealth} 
                disabled={loading}
                className="mb-4"
              >
                {loading ? 'Checking...' : 'Run Health Check'}
              </Button>
              
              {healthStatus && (
                <Alert className={`${
                  healthStatus.status === 'ok' 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-red-500 bg-red-500/10'
                }`}>
                  <AlertDescription>
                    <pre className="text-sm">
                      {JSON.stringify(healthStatus, null, 2)}
                    </pre>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>API Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={testHackathonsAPI} className="mb-4">
                Test Hackathons API (Check Console)
              </Button>
              <p className="text-sm text-gray-400">
                This will test the hackathons API and log the raw response to the browser console.
                Open Developer Tools → Console to see the output.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Database Content Check</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={checkDatabaseContent} className="mb-4">
                Check Database Tables
              </Button>
              
              {dbContent && (
                <Alert className="mb-4">
                  <AlertDescription>
                    <pre className="text-sm whitespace-pre-wrap">
                      {JSON.stringify(dbContent, null, 2)}
                    </pre>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Teams Debug</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={async () => {
                  try {
                    const response = await fetch('/api/debug/teams')
                    const data = await response.json()
                    console.log('Teams debug:', data)
                    alert('Check console for teams data')
                  } catch (error) {
                    console.error('Teams debug error:', error)
                  }
                }} 
                className="mb-4"
              >
                Check Teams Data
              </Button>
              <p className="text-sm text-gray-400">
                This will check if teams exist in the database and log the results to console.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Quick Database Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Option 1: Auto-seed (Quick Fix)</h4>
                  <Button 
                    onClick={seedDatabase} 
                    disabled={seeding}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {seeding ? 'Seeding...' : 'Insert Sample Data'}
                  </Button>
                  <p className="text-sm text-gray-400 mt-2">
                    This will automatically create tables and insert sample hackathons and users.
                  </p>
                </div>
                
                {seedResult && (
                  <Alert className={`${
                    seedResult.status === 'success' 
                      ? 'border-green-500 bg-green-500/10' 
                      : 'border-red-500 bg-red-500/10'
                  }`}>
                    <AlertDescription>
                      <pre className="text-sm">
                        {JSON.stringify(seedResult, null, 2)}
                      </pre>
                    </AlertDescription>
                  </Alert>
                )}
                
                <div>
                  <h4 className="font-semibold mb-2">Option 2: Manual SQL (Recommended)</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-400">
                    <li>Go to your Supabase project → SQL Editor</li>
                    <li>Copy and run the contents of scripts/01-create-tables.sql</li>
                    <li>Copy and run the contents of scripts/02-seed-data.sql</li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{' '}
                  <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-400' : 'text-red-400'}>
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing'}
                  </span>
                </div>
                <div>
                  <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{' '}
                  <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-400' : 'text-red-400'}>
                    {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Create .env.local file:</h4>
                <pre className="bg-gray-800 p-3 rounded text-xs overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`}
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">2. Run database scripts:</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-400">
                  <li>Go to your Supabase project → SQL Editor</li>
                  <li>Run scripts/01-create-tables.sql</li>
                  <li>Run scripts/02-seed-data.sql</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">3. Restart development server:</h4>
                <pre className="bg-gray-800 p-3 rounded text-xs">
                  npm run dev
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
