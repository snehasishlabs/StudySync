import React, { useState, useEffect } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isToday } from 'date-fns';
import './Calendar.css';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('calendar_notes');
    return saved ? JSON.parse(saved) : {};
  });

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Persist notes to localStorage
  useEffect(() => {
    localStorage.setItem('calendar_notes', JSON.stringify(notes));
  }, [notes]);

  const renderDay = (day) => {
    const isCurrent = isToday(day);
    const noteKey = format(day, 'yyyy-MM-dd');
    const hasNote = notes[noteKey] && notes[noteKey].trim() !== '';
    const classNames = `calendar-day ${isCurrent ? 'today' : ''} ${hasNote ? 'has-note' : ''}`;
    return (
      <div
        key={day}
        className={classNames}
        onClick={() => setSelectedDate(day)}
      >
        {format(day, 'd')}
      </div>
    );
  };

  // Pad the first week with empty cells if month doesn't start on Sunday
  const startWeekDay = monthStart.getDay(); // 0 = Sunday
  const paddingDays = Array.from({ length: startWeekDay }, (_, i) => (
    <div key={`pad-${i}`} className="calendar-day empty" />
  ));

  return (
    <div className="calendar-page glass-panel" style={{ padding: '2rem' }}>
      <h1 className="page-title">Calendar</h1>
      <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button className="btn" onClick={prevMonth}>← Prev</button>
        <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
        <button className="btn" onClick={nextMonth}>Next →</button>
      </div>
      <div className="calendar-grid">
        {/* Weekday labels */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((wd) => (
          <div key={wd} className="calendar-day header">{wd}</div>
        ))}
        {/* Padding days */}
        {paddingDays}
        {/* Actual days */}
        {days.map(renderDay)}
      </div>
      {selectedDate && (
        <div className="note-section glass-panel" style={{ marginTop: '1rem', padding: '1rem' }}>
          <h3>Notes for {format(selectedDate, 'PPP')}</h3>
          <textarea
            rows={4}
            style={{ width: '100%', marginTop: '0.5rem' }}
            value={notes[format(selectedDate, 'yyyy-MM-dd')] || ''}
            onChange={(e) =>
              setNotes({
                ...notes,
                [format(selectedDate, 'yyyy-MM-dd')]: e.target.value,
              })
            }
          />
        </div>
      )}
    </div>
  );
};

export default Calendar;
