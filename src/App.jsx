import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BreathingCircle from './components/BreathingCircle'
import ControlPanel from './components/ControlPanel'
import './App.css'

function App() {
  const [breathingState, setBreathingState] = useState('idle')
  const [isActive, setIsActive] = useState(false)
  const [cycles, setCycles] = useState(0)
  const [totalCycles, setTotalCycles] = useState(3)
  const [error, setError] = useState(null)

  // Add constants for timing
  const INHALE_DURATION = 4000
  const HOLD_DURATION = 7000
  const EXHALE_DURATION = 8000
  const TRANSITION_DELAY = 100

  useEffect(() => {
    let timer;
    
    if (isActive) {
      try {
        if (breathingState === 'idle') {
          setBreathingState('inhale');
        } else if (breathingState === 'inhale') {
          timer = setTimeout(() => {
            setBreathingState('hold');
          }, INHALE_DURATION);
        } else if (breathingState === 'hold') {
          timer = setTimeout(() => {
            setBreathingState('exhale');
          }, HOLD_DURATION);
        } else if (breathingState === 'exhale') {
          timer = setTimeout(() => {
            const nextCycle = cycles + 1;
            
            if (nextCycle < totalCycles) {
              setCycles(nextCycle);
              setTimeout(() => {
                setBreathingState('inhale');
              }, TRANSITION_DELAY);
            } else {
              handleStop();
            }
          }, EXHALE_DURATION);
        }
      } catch (err) {
        setError(err.message);
        handleStop();
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [breathingState, isActive, cycles, totalCycles]);

  const handleStart = () => {
    setIsActive(true)
    setBreathingState('inhale')
  }

  const handleStop = () => {
    setIsActive(false)
    setBreathingState('idle')
    setCycles(0)
  }

  const handleCycleChange = (newCycles) => {
    setTotalCycles(newCycles)
  }

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        isActive ? handleStop() : handleStart();
      } else if (e.code === 'ArrowUp' && !isActive) {
        handleCycleChange(Math.min(totalCycles + 1, 10));
      } else if (e.code === 'ArrowDown' && !isActive) {
        handleCycleChange(Math.max(totalCycles - 1, 1));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive, totalCycles]);

  return (
    <motion.div
      className="app-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      <h1 className="title">Mindful Breathing</h1>
      <h2 className="subtitle">4-7-8 Technique</h2>
      
      <div className="main-content">
        <BreathingCircle state={breathingState} />
        
        <AnimatePresence mode="wait">
          <motion.div
            className="instruction-text"
            key={breathingState}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {breathingState === 'idle' && 'Press start to begin'}
            {breathingState === 'inhale' && 'Inhale through your nose (4s)'}
            {breathingState === 'hold' && 'Hold your breath (7s)'}
            {breathingState === 'exhale' && 'Exhale through your mouth (8s)'}
          </motion.div>
        </AnimatePresence>
        
        <motion.div
          className="progress-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isActive && `Cycle ${cycles + 1} of ${totalCycles}`}
        </motion.div>
        
        <ControlPanel 
          isActive={isActive}
          onStart={handleStart}
          onStop={handleStop}
          totalCycles={totalCycles}
          onCycleChange={handleCycleChange}
        />
      </div>
    </motion.div>
  )
}

export default App
