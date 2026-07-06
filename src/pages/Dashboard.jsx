import React, { useState, useEffect } from 'react';
import { CheckSquare, BrainCircuit, GraduationCap, Trophy } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    tasksTotal: 0,
    tasksCompleted: 0,
    flashcards: 0,
    quizzes: 0
  });

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem('studysync_tasks') || '[]');
    const flashcards = JSON.parse(localStorage.getItem('studysync_flashcards') || '[]');
    const quizzes = JSON.parse(localStorage.getItem('studysync_quizzes') || '[]');

    setStats({
      tasksTotal: tasks.length,
      tasksCompleted: tasks.filter(t => t.completed).length,
      flashcards: flashcards.length,
      quizzes: quizzes.length
    });
  }, []);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Welcome Back, Scholar! 👋</h1>
        <p>Here's a quick overview of your study progress.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon bg-blue"><CheckSquare size={24} /></div>
          <div className="stat-info">
            <h3>To-Do List</h3>
            <p>{stats.tasksCompleted} / {stats.tasksTotal} Completed</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon bg-purple"><BrainCircuit size={24} /></div>
          <div className="stat-info">
            <h3>Flashcards</h3>
            <p>{stats.flashcards} Cards in Deck</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon bg-orange"><GraduationCap size={24} /></div>
          <div className="stat-info">
            <h3>Quizzes</h3>
            <p>{stats.quizzes} Questions Available</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon bg-green"><Trophy size={24} /></div>
          <div className="stat-info">
            <h3>Progress</h3>
            <p>
              {stats.tasksTotal > 0 
                ? Math.round((stats.tasksCompleted / stats.tasksTotal) * 100) 
                : 0}% Tasks Done
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="glass-panel tips-panel">
          <h2>Study Tip of the Day</h2>
          <p>
            "Use the Pomodoro Technique to maintain focus and prevent mental fatigue. 
            Work for 25 minutes, then take a 5-minute break."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
