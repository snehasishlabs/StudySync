import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCw } from 'lucide-react';
import alarm1 from '../assets/sounds/alarm1.mp3';
import alarm2 from '../assets/sounds/alarm2.mp3';
import alarm3 from '../assets/sounds/alarm3.mp3';

const Pomodoro = () => {
  const WORK_MINUTES = 25;
  const BREAK_MINUTES = 5;

    // Sound variation options
  // Sound variation options using pre‑recorded alarm files
  // Sound variation options using pre‑recorded alarm files
  const soundVariants = [
    { name: 'Alarm 1', src: alarm1 },
    { name: 'Alarm 2', src: alarm2 },
    { name: 'Alarm 3', src: alarm3 },
  ];
  const [variantIndex, setVariantIndex] = useState(0);

  // Play the selected alarm sound using an HTMLAudioElement
  const playBeep = () => {
    try {
      const sound = soundVariants[variantIndex];
      const audio = new Audio(sound.src);
      audio.play();
    } catch (e) {
      console.error('Alarm playback failed', e);
    }
  };

  const cycleSoundVariant = () => {
    setVariantIndex((variantIndex + 1) % soundVariants.length);
  };
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(WORK_MINUTES * 60);

  const intervalRef = useRef(null);

  const [alarmMessage, setAlarmMessage] = useState("");

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((sec) => {
          if (sec <= 0) {
            // Play alarm sound on session switch
            playBeep();
            // Show visual alarm message
            setAlarmMessage(isWorkSession ? "Work session ended! Time for a break." : "Break over! Back to work.");
            // Clear alarm after 3 seconds
            setTimeout(() => setAlarmMessage(""), 3000);
            // Switch session
            const nextIsWork = !isWorkSession;
            setIsWorkSession(nextIsWork);
            return (nextIsWork ? WORK_MINUTES : BREAK_MINUTES) * 60;
          }
          return sec - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isWorkSession]);

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const seconds = (secondsLeft % 60).toString().padStart(2, '0');

  const handleStartPause = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false);
    setIsWorkSession(true);
    setSecondsLeft(WORK_MINUTES * 60);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Pomodoro Timer</h1>
      <div className="timer-display" style={{ fontSize: '4rem', margin: '1rem 0' }}>
        {minutes}:{seconds}
      </div>
      <div className="session-type" style={{ marginBottom: '1rem' }}>
        {isWorkSession ? 'Focus Session' : 'Break'}
      </div>
        {alarmMessage && (
          <div className="alarm-message" style={{ marginTop: '0.5rem', color: 'var(--accent-color)', fontWeight: '500' }}>{alarmMessage}</div>
        )}
      <button className="btn" onClick={handleStartPause} style={{ marginRight: '0.5rem' }}>
        {isRunning ? <Pause size={20} /> : <Play size={20} />} {isRunning ? 'Pause' : 'Start'}
      </button>
        <button className="btn btn-secondary" onClick={cycleSoundVariant} style={{ marginRight: '0.5rem' }}>
          Change Sound ({soundVariants[variantIndex].name})
        </button>
      <button className="btn btn-secondary" onClick={handleReset}>
        <RotateCw size={20} /> Reset
      </button>
    </div>
  );
};

export default Pomodoro;
