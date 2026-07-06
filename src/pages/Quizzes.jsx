import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import './Quizzes.css';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState(() => {
    const saved = localStorage.getItem('studysync_quizzes');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [mode, setMode] = useState('take'); 
  
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState(0);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    localStorage.setItem('studysync_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  const handleOptionChange = (index, value) => {
    const updated = [...newOptions];
    updated[index] = value;
    setNewOptions(updated);
  };

  const addQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || newOptions.some(opt => !opt.trim())) return;
    
    setQuizzes([...quizzes, {
      id: Date.now(),
      question: newQuestion,
      options: newOptions,
      correctIndex: correctOption
    }]);
    
    setNewQuestion('');
    setNewOptions(['', '', '', '']);
    setCorrectOption(0);
  };

  const deleteQuestion = (id) => {
    setQuizzes(quizzes.filter(q => q.id !== id));
  };

  const submitAnswer = (index) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    if (index === quizzes[currentQIndex].correctIndex) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < quizzes.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setMode('results');
    }
  };

  const restartQuiz = () => {
    setCurrentQIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setMode('take');
  };

  return (
    <div className="quizzes-page">
      <div className="page-header">
        <h1 className="page-title">Quizzes</h1>
        <div className="mode-toggle glass-panel">
          <button 
            className={`btn-toggle ${mode === 'take' || mode === 'results' ? 'active' : ''}`}
            onClick={restartQuiz}
          >
            Take Quiz
          </button>
          <button 
            className={`btn-toggle ${mode === 'manage' ? 'active' : ''}`}
            onClick={() => setMode('manage')}
          >
            Manage Questions
          </button>
        </div>
      </div>

      {mode === 'manage' ? (
        <div className="manage-mode">
          <form onSubmit={addQuestion} className="add-quiz-form glass-panel">
            <h3>Add New Question</h3>
            <input 
              className="input-field mb-1" 
              placeholder="Question text" 
              value={newQuestion} 
              onChange={(e) => setNewQuestion(e.target.value)} 
            />
            
            <div className="options-grid">
              {newOptions.map((opt, i) => (
                <div key={i} className="option-input-wrapper">
                  <input 
                    type="radio" 
                    name="correctOption" 
                    checked={correctOption === i} 
                    onChange={() => setCorrectOption(i)}
                    className="radio-input"
                  />
                  <input 
                    className="input-field" 
                    placeholder={`Option ${i + 1}`} 
                    value={opt} 
                    onChange={(e) => handleOptionChange(i, e.target.value)} 
                  />
                </div>
              ))}
            </div>
            <button type="submit" className="btn mt-1"><Plus size={20}/> Add Question</button>
          </form>

          <div className="quiz-list">
            {quizzes.map((q, idx) => (
              <div key={q.id} className="quiz-list-item glass-panel">
                <div className="quiz-content">
                  <div className="q-text"><strong>Q{idx + 1}:</strong> {q.question}</div>
                  <ul className="q-options">
                    {q.options.map((opt, i) => (
                      <li key={i} className={q.correctIndex === i ? 'correct-text' : ''}>
                        {opt} {q.correctIndex === i && '(Correct)'}
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="btn-icon danger" onClick={() => deleteQuestion(q.id)}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            {quizzes.length === 0 && <p className="empty-text" style={{textAlign: 'center', color: '#94a3b8'}}>No questions yet.</p>}
          </div>
        </div>
      ) : mode === 'results' ? (
        <div className="results-container glass-panel">
          <h2>Quiz Completed!</h2>
          <div className="score-display">
            <span className="score-number">{score}</span>
            <span className="score-total">/ {quizzes.length}</span>
          </div>
          <p className="score-message">
            {score === quizzes.length && quizzes.length > 0 ? 'Perfect score! Outstanding work!' : 
             score >= quizzes.length / 2 && quizzes.length > 0 ? 'Good job! Keep practicing.' : 
             'Keep studying, you will get it next time!'}
          </p>
          <button className="btn" onClick={restartQuiz}>Restart Quiz</button>
        </div>
      ) : (
        <div className="take-mode">
          {quizzes.length === 0 ? (
            <div className="empty-state glass-panel" style={{padding: '3rem', textAlign: 'center', color: '#94a3b8'}}>
              <p>No questions available. Add some in Manage Questions!</p>
            </div>
          ) : (
            <div className="quiz-container glass-panel">
              <div className="quiz-progress">
                Question {currentQIndex + 1} of {quizzes.length}
              </div>
              <h2 className="quiz-question">{quizzes[currentQIndex].question}</h2>
              
              <div className="quiz-options">
                {quizzes[currentQIndex].options.map((opt, i) => {
                  let optionClass = 'quiz-option';
                  let icon = null;
                  
                  if (isAnswered) {
                    if (i === quizzes[currentQIndex].correctIndex) {
                      optionClass += ' correct';
                      icon = <CheckCircle2 size={20} className="icon-success" />;
                    } else if (i === selectedAnswer) {
                      optionClass += ' wrong';
                      icon = <XCircle size={20} className="icon-danger" />;
                    }
                  } else if (selectedAnswer === i) {
                    optionClass += ' selected';
                  }

                  return (
                    <button 
                      key={i} 
                      className={optionClass}
                      onClick={() => submitAnswer(i)}
                      disabled={isAnswered}
                    >
                      <span>{opt}</span>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="quiz-actions">
                  <button className="btn next-btn" onClick={nextQuestion}>
                    {currentQIndex < quizzes.length - 1 ? 'Next Question' : 'View Results'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quizzes;
