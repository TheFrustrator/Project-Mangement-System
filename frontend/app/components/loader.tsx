export const Loader = () => {
    return <div>
         <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="flex items-center space-x-4 animate-pulse">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div>
          <h1 className="text-2xl font-semibold">TaskManager</h1>
          <p className="text-sm text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    </div>
    </div>
}