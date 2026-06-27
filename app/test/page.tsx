export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-green-400">
          ✅ HackConnect is Running!
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Your project is successfully running on the development server.
        </p>
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-400 mb-2">Server Status</h2>
            <p className="text-green-400">✅ Development server is running</p>
            <p className="text-green-400">✅ TypeScript compilation successful</p>
            <p className="text-green-400">✅ Next.js application loaded</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-purple-400 mb-2">Available Routes</h2>
            <div className="text-left space-y-1">
              <p className="text-gray-300">• <span className="text-blue-400">http://localhost:3000</span> - Home page</p>
              <p className="text-gray-300">• <span className="text-blue-400">http://localhost:3000/test</span> - This test page</p>
              <p className="text-gray-300">• <span className="text-blue-400">http://localhost:3000/messages</span> - Messages page</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}