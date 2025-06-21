// This will be the home page users are directed to after logging in / creating an account 

import { LogOut, User, Trophy, Target, BarChart3 } from 'lucide-react';

const Home = ({ user, onLogout }) => {
  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Algorithm Athletes</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700 font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome back, {user?.firstName}! 👋
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Ready to tackle some algorithms? Your journey to becoming an algorithm athlete starts here.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Problems Solved</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">0 days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">0%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition duration-200 text-left">
              <div className="flex items-center mb-3">
                <Target className="h-6 w-6 text-purple-600 mr-3" />
                <h4 className="font-semibold text-gray-900">Start Practice</h4>
              </div>
              <p className="text-gray-600 text-sm">Begin solving algorithm problems</p>
            </button>

            <button className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition duration-200 text-left">
              <div className="flex items-center mb-3">
                <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
                <h4 className="font-semibold text-gray-900">View Progress</h4>
              </div>
              <p className="text-gray-600 text-sm">Check your learning progress</p>
            </button>

            <button className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition duration-200 text-left">
              <div className="flex items-center mb-3">
                <Trophy className="h-6 w-6 text-green-600 mr-3" />
                <h4 className="font-semibold text-gray-900">Leaderboard</h4>
              </div>
              <p className="text-gray-600 text-sm">See how you rank among others</p>
            </button>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">🚀 More Features Coming Soon!</h3>
            <p className="text-purple-100 text-lg max-w-2xl mx-auto">
              We're working hard to bring you advanced algorithm challenges, 
              detailed analytics, and a competitive leaderboard system.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home; 