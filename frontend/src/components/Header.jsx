import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout, title = "FITNESS QUEST" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <header className="relative z-10 bg-gradient-to-r from-green-800 to-green-600 shadow-lg border-b-4 border-yellow-400" style={{
      fontFamily: 'monospace',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)'
    }}>
      <div className="w-full px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={goHome}>
            <div className="text-3xl mr-3 animate-pulse">⚔️</div>
            <h1 className="text-2xl font-bold text-yellow-300 tracking-wider hover:text-yellow-200 transition-colors" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              {title}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-black bg-opacity-30 px-3 py-1 rounded-lg border border-yellow-400">
              <div className="text-yellow-300">👤</div>
              <span className="text-yellow-100 font-bold text-sm">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg border-2 border-red-800 font-bold text-sm transition-all duration-200 transform hover:scale-105"
              style={{ fontFamily: 'monospace', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
            >
              <LogOut className="h-4 w-4" />
              <span>QUIT</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 