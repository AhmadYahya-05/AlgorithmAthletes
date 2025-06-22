import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NutritionistPage from './pages/NutritionistPage';
import PersonalTrainerPage from './pages/PersonalTrainerPage';
import AIChatbotPage from './pages/AIChatbotPage';
import AIFormChecker from './pages/AIFormChecker';
import Character from './pages/Character';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';
import WorkoutTracker from './pages/WorkoutTracker';
import { API_ENDPOINTS } from './config/api.js';
import './App.css';
import { UserProvider } from './context/UserContext.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.ME, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
        setIsAuthenticated(true);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                  <Navigate to="/" replace /> : 
                  <Login onLogin={login} />
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? 
                  <Navigate to="/" replace /> : 
                  <Register onRegister={login} />
              } 
            />
            <Route 
              path="/" 
              element={
                isAuthenticated ? 
                  <Home user={user} onLogout={logout} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/nutritionist" 
              element={
                isAuthenticated ? 
                  <NutritionistPage user={user} onLogout={logout} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/trainer" 
              element={
                isAuthenticated ? 
                  <PersonalTrainerPage user={user} onLogout={logout} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/ai-coach" 
              element={
                isAuthenticated ? 
                  <AIChatbotPage user={user} onLogout={logout} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/ai-form-checker" 
              element={
                isAuthenticated ? 
                  <AIFormChecker user={user} onLogout={logout} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/character" 
              element={
                isAuthenticated ? 
                  <Character user={user} onLogout={logout} onNavigateBack={() => window.history.back()} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/profile" 
              element={
                isAuthenticated ? 
                  <ProfilePage user={user} onLogout={logout} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/friends" 
              element={
                isAuthenticated ? 
                  <FriendsPage user={user} onLogout={logout} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/tracker" 
              element={
                isAuthenticated ? 
                  <WorkoutTracker user={user} onLogout={logout} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
