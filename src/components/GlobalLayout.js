import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './GlobalLayout.css';
import { create } from 'zustand';

// Store for course state including XP and hearts
export const useCourseStore = create((set) => ({
  selectedCourseId: 1,
  selectedCourseName: 'English',
  xp: 0,
  hearts: 5,

  setCourse: (id, name) => set({ selectedCourseId: id, selectedCourseName: name }),

  toggleCourse: () =>
    set((state) =>
      state.selectedCourseId === 1
        ? { selectedCourseId: 2, selectedCourseName: 'Nepali' }
        : { selectedCourseId: 1, selectedCourseName: 'English' }
    ),

  setXp: (xp) => set({ xp }),
  addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

  loseHeart: () => set((state) => ({ hearts: Math.max(0, state.hearts - 1) })),
  refillHeart: () => set((state) => ({ hearts: Math.min(5, state.hearts + 1) })),
  resetHearts: () => set({ hearts: 5 }),
}));

export const useProgressStore = create((set) => ({
  progress: [],
  setProgress: (progress) => set({ progress }),

  addOrUpdateProgress: (lessonId, xp, completed) =>
    set((state) => {
      const existingIndex = state.progress.findIndex((p) => p.lessonId === lessonId);
      if (existingIndex !== -1) {
        const updated = [...state.progress];
        updated[existingIndex] = { ...updated[existingIndex], xp, completed };
        return { progress: updated };
      } else {
        return {
          progress: [...state.progress, { lessonId, xp, completed }],
        };
      }
    }),
}));

const GlobalLayout = ({ children }) => {
  const location = useLocation();
  const { selectedCourseName, toggleCourse, xp, hearts } = useCourseStore();

  const navItems = [
    { name: 'Learn', path: '/dashboard', icon: '📘' },
    { name: 'Leaderboard', path: '/leaderboard', icon: '🏆' },
    { name: 'Quests', path: '/quests', icon: '🎯' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <div className="global-container">
      {/* Sidebar */}
      <aside className="global-sidebar">
        <div className="logo">✨ Tiny Talker</div>
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`sidebar-btn ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
          >
            <span>{item.icon}</span> {item.name}
          </Link>
        ))}
      </aside>

      {/* Main section */}
      <div className="global-main">
        {/* Top Bar */}
        <header className="global-topbar">
          <div className="stat">❤️ {hearts}</div>
          <div className="stat language-toggle" onClick={toggleCourse}>
            🌐 {selectedCourseName}
          </div>
          <div className="stat">⭐ {xp} XP</div>
        </header>

        {/* Main content area */}
        <main className="global-content">{children}</main>
      </div>
    </div>
  );
};

export default GlobalLayout;
