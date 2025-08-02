import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BreathingCircle from './components/BreathingCircle'
import ControlPanel from './components/ControlPanel'
import BreathingCircleErrorBoundary from './components/BreathingCircleErrorBoundary'
import ControlPanelErrorBoundary from './components/ControlPanelErrorBoundary'
import { useError } from './contexts/ErrorContext.jsx';
import { AppError } from './utils/AppError';
import { ErrorTypes } from './utils/errorTypes';
import './App.css'

function App() {
  const [breathingState, setBreathingState] = useState('idle')
  const [isActive, setIsActive] = useState(false)
  const [cycles, setCycles] = useState(0)
  const [totalCycles, setTotalCycles] = useState(3)
  const [hidingErrorId, setHidingErrorId] = useState(null)
  const { addError, clearError, activeError } = useError()
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Event handler definitions must come before useEffects that use them.
  const handleStop = useCallback(() => {
    try {
      setIsActive(false);
      setBreathingState('idle');
      setCycles(0);
      setTimeRemaining(0);
    } catch (err) {
      const error = new AppError(
        'Failed to stop the breathing exercise. Please try refreshing the page.',
        ErrorTypes.FUNCTIONAL,
        'medium',
        err
      );
      addError(error);
    }
  }, [addError]);

  const handleStart = useCallback(() => {
    try {
      setIsActive(true);
      setBreathingState('inhale');
    } catch (err) {
      const error = new AppError(
        'Failed to start the breathing exercise. Please try again.',
        ErrorTypes.FUNCTIONAL,
        'medium',
        err
      );
      addError(error);
    }
  }, [addError]);

  const handleCycleChange = useCallback((newCycles) => {
    try {
      setTotalCycles(newCycles);
    } catch (err) {
      const error = new AppError(
        'Failed to change the number of cycles. Please try again.',
        ErrorTypes.FUNCTIONAL,
        'low',
        err
      );
      addError(error);
    }
  }, [addError]);

  const handleSkip = useCallback(() => {
    try {
      const nextCycle = cycles + 1;
      if (nextCycle < totalCycles) {
        setCycles(nextCycle);
        setBreathingState('inhale');
      } else {
        handleStop();
      }
    } catch (err) {
      const error = new AppError(
        'Failed to skip to the next cycle. Please try again.',
        ErrorTypes.FUNCTIONAL,
        'low',
        err
      );
      addError(error);
    }
  }, [cycles, totalCycles, handleStop, addError]);

  // Constants for timing
  const INHALE_DURATION = 4000
  const HOLD_DURATION = 7000
  const EXHALE_DURATION = 8000

  // useEffect for breathing cycle and countdown timer
  useEffect(() => {
    if (!isActive) {
      setTimeRemaining(0);
      return;
    }

    let transitionTimer;
    let countdownTimer;
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const stateConfig = {
      inhale: { duration: INHALE_DURATION, nextState: 'hold' },
      hold: { duration: HOLD_DURATION, nextState: 'exhale' },
      exhale: { duration: EXHALE_DURATION, nextState: 'cycleEnd' },
    };

    const currentStateConfig = stateConfig[breathingState];

    if (currentStateConfig) {
      const { duration, nextState } = currentStateConfig;
      const durationInSeconds = duration / 1000;
      setTimeRemaining(durationInSeconds);

      transitionTimer = setTimeout(() => {
        if (nextState === 'cycleEnd') {
          if (cycles + 1 < totalCycles) {
            setCycles(cycles + 1);
            setBreathingState('inhale');
          } else {
            handleStop();
          }
        } else {
          setBreathingState(nextState);
        }
      }, prefersReducedMotion ? 0 : duration);

      countdownTimer = setInterval(() => {
        setTimeRemaining(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    } else {
      setTimeRemaining(0);
    }

    return () => {
      clearTimeout(transitionTimer);
      clearInterval(countdownTimer);
    };
  }, [breathingState, isActive, cycles, totalCycles, handleStop]);


  useEffect(() => {
    const handleKeyPress = (e) => {
      try {
        if (e.code === 'Space') {
          e.preventDefault();
          isActive ? handleStop() : handleStart();
        } else if (e.code === 'ArrowUp' && !isActive) {
          handleCycleChange(Math.min(totalCycles + 1, 10));
        } else if (e.code === 'ArrowDown' && !isActive) {
          handleCycleChange(Math.max(totalCycles - 1, 1));
        }
      } catch (err) {
        const error = new AppError(
          'An error occurred while processing your key press. Please try again.',
          ErrorTypes.USER_INPUT,
          'low',
          err
        );
        addError(error);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive, totalCycles, addError, handleCycleChange, handleStart, handleStop]);

  // Handle error dismissal with animation
  const handleErrorDismiss = (errorId) => {
    setHidingErrorId(errorId);
    setTimeout(() => {
      clearError(errorId);
      setHidingErrorId(null);
    }, 300); // Match the animation duration
  };

  const instructionMap = {
    idle: 'Press start to begin',
    inhale: `Inhale through your nose (${timeRemaining}s)`,
    hold: `Hold your breath (${timeRemaining}s)`,
    exhale: `Exhale through your mouth (${timeRemaining}s)`,
  };


  return (
    <>
      {/* Skip to main content link for keyboard users */}
      <a href="#main" className="sr-only sr-only-focusable">Skip to main content</a>

      {/* Live region for screen readers to announce state changes */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only" aria-relevant="text">
        {breathingState === 'idle' && 'Idle. Press start to begin.'}
        {breathingState === 'inhale' && `Inhale for ${INHALE_DURATION / 1000} seconds.`}
        {breathingState === 'hold' && `Hold for ${HOLD_DURATION / 1000} seconds.`}
        {breathingState === 'exhale' && `Exhale for ${EXHALE_DURATION / 1000} seconds.`}
        {isActive && `Cycle ${cycles + 1} of ${totalCycles}.`}
      </div>

      <motion.div
        className="app-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Error notification */}
        {activeError && (
          <div className={`error-notification ${activeError.type} ${hidingErrorId === activeError.id ? 'hiding' : ''}`}>
            <div className="error-content">
              <p>{activeError.message}</p>
              <button
                className="error-dismiss"
                onClick={() => handleErrorDismiss(activeError.id)}
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        <h1 className="title">Mindful Breathing</h1>
        <h2 className="subtitle">4-7-8 Technique</h2>
        
        <div id="main" className="main-content" tabIndex="-1" role="main" aria-label="Breathing exercise main content">
          <BreathingCircleErrorBoundary onRefresh={() => setBreathingState('idle')}>
            <BreathingCircle state={breathingState} />
          </BreathingCircleErrorBoundary>
          
          <AnimatePresence mode="wait">
            <motion.div
              className="instruction-text"
              key={breathingState}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              {instructionMap[breathingState]}
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
          
          <ControlPanelErrorBoundary onReset={handleStop}>
            <ControlPanel
              isActive={isActive}
              onStart={handleStart}
              onStop={handleStop}
              totalCycles={totalCycles}
              onCycleChange={handleCycleChange}
              onSkip={handleSkip}
            />
          </ControlPanelErrorBoundary>
        </div>
      </motion.div>
    </>
  )
}

export default App
