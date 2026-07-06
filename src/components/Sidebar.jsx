import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Timer, BrainCircuit, GraduationCap, Settings, Calendar } from 'lucide-react';

import './Sidebar.css';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/tasks', name: 'To-Do List', icon: CheckSquare },
    { path: '/pomodoro', name: 'Pomodoro', icon: Timer },
    { path: '/settings', name: 'Settings', icon: Settings },
    { path: '/calendar', name: 'Calendar', icon: Calendar },
    { path: '/flashcards', name: 'Flashcards', icon: BrainCircuit },
    { path: '/quizzes', name: 'Quizzes', icon: GraduationCap },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <h2>StudySync</h2>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
