"use client"

import { useParams } from "next/navigation"

export default function TestProfilePage() {
  const params = useParams()
  const userId = params.id as string

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Test Profile Page</h1>
      <p>User ID: {userId}</p>
      <p>Params: {JSON.stringify(params)}</p>
      <p>This is a test page to verify routing works.</p>
    </div>
  )
}
