import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OpeningPage from './pages/OpeningPage';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import UnitPage from './pages/UnitPage';
import LessonPage from './pages/LessonPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import QuestsPage from './pages/QuestsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

// ✅ New legal pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import CookiePolicy from './pages/CookiePolicy';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<OpeningPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Legal Pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/learn" element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />
        <Route path="/unit/:id" element={<ProtectedRoute><UnitPage /></ProtectedRoute>} />
        <Route path="/course/:id" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/quests" element={<ProtectedRoute><QuestsPage /></ProtectedRoute>} />
        
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
