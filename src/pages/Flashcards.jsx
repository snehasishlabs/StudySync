import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import './Flashcards.css';

const Flashcards = () => {
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('studysync_flashcards');
    return saved ? JSON.parse(saved) : [];
  });
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mode, setMode] = useState('study'); // 'study' or 'manage'

  useEffect(() => {
    localStorage.setItem('studysync_flashcards', JSON.stringify(cards));
  }, [cards]);

  const addCard = (e) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    setCards([...cards, { id: Date.now(), front, back }]);
    setFront('');
    setBack('');
  };

  const deleteCard = (id) => {
    setCards(cards.filter(c => c.id !== id));
    if (currentIndex >= cards.length - 1) {
      setCurrentIndex(Math.max(0, cards.length - 2));
    }
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex + 1), 150);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex - 1), 150);
    }
  };

  return (
    <div className="flashcards-page">
      <div className="page-header">
        <h1 className="page-title">Flashcards</h1>
        <div className="mode-toggle glass-panel">
          <button 
            className={`btn-toggle ${mode === 'study' ? 'active' : ''}`}
            onClick={() => setMode('study')}
          >
            Study Mode
          </button>
          <button 
            className={`btn-toggle ${mode === 'manage' ? 'active' : ''}`}
            onClick={() => setMode('manage')}
          >
            Manage Deck
          </button>
        </div>
      </div>

      {mode === 'manage' ? (
        <div className="manage-mode">
          <form onSubmit={addCard} className="add-card-form glass-panel">
            <h3>Create New Card</h3>
            <div className="input-group">
              <input 
                className="input-field" 
                placeholder="Front side (Question)" 
                value={front} onChange={(e) => setFront(e.target.value)} 
              />
              <input 
                className="input-field" 
                placeholder="Back side (Answer)" 
                value={back} onChange={(e) => setBack(e.target.value)} 
              />
              <button type="submit" className="btn"><Plus size={20}/></button>
            </div>
          </form>

          <div className="card-list">
            {cards.map(card => (
              <div key={card.id} className="card-list-item glass-panel">
                <div className="card-list-content">
                  <div className="card-side"><span className="label">Front:</span> {card.front}</div>
                  <div className="card-side"><span className="label">Back:</span> {card.back}</div>
                </div>
                <button className="btn-icon danger" onClick={() => deleteCard(card.id)}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            {cards.length === 0 && <p className="empty-text" style={{textAlign: 'center', color: '#94a3b8'}}>Your deck is empty.</p>}
          </div>
        </div>
      ) : (
        <div className="study-mode">
          {cards.length === 0 ? (
            <div className="empty-state glass-panel" style={{padding: '3rem', textAlign: 'center', color: '#94a3b8'}}>
              <p>No cards to study! Switch to Manage Deck to add some.</p>
            </div>
          ) : (
            <div className="study-container">
              <div className="card-progress">
                Card {currentIndex + 1} of {cards.length}
              </div>
              
              <div className="flashcard-wrapper" onClick={() => setIsFlipped(!isFlipped)}>
                <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
                  <div className="flashcard-face front glass-panel">
                    <p>{cards[currentIndex].front}</p>
                    <span className="hint">Click to flip</span>
                  </div>
                  <div className="flashcard-face back glass-panel">
                    <p>{cards[currentIndex].back}</p>
                  </div>
                </div>
              </div>

              <div className="study-controls">
                <button className="btn-icon" onClick={prevCard} disabled={currentIndex === 0}>
                  <ChevronLeft size={32} />
                </button>
                <button className="btn-icon" onClick={() => setIsFlipped(false)}>
                  <RotateCcw size={24} />
                </button>
                <button className="btn-icon" onClick={nextCard} disabled={currentIndex === cards.length - 1}>
                  <ChevronRight size={32} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Flashcards;
