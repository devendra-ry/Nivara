import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useError } from '../contexts/ErrorContext.jsx';
import { AppError } from '../utils/AppError';
import { ErrorTypes } from '../utils/errorTypes';
import './ControlPanel.css'

const ControlPanel = ({ isActive, onStart, onStop, onSkip, totalCycles, onCycleChange }) => {
  const { addError } = useError();
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Handle cycle selection with error handling
  const handleCycleChange = (e) => {
    try {
      const value = Number(e.target.value);
      if (isNaN(value) || value < 1 || value > 10) {
        throw new Error('Invalid cycle value');
      }
      onCycleChange(value);
    } catch (err) {
      const error = new AppError(
        'Failed to change the number of cycles. Please select a valid number between 1 and 10.',
        ErrorTypes.USER_INPUT,
        'low',
        err
      ).addContext('component', 'ControlPanel')
       .addContext('function', 'handleCycleChange')
       .addContext('selectedValue', e.target.value);
      
      addError(error);
    }
  };

  // Handle button clicks with error handling
  const handleStart = () => {
    try {
      if (typeof onStart !== 'function') {
        throw new Error('Start function is not available');
      }
      onStart();
    } catch (err) {
      const error = new AppError(
        'Failed to start the breathing exercise. Please try again.',
        ErrorTypes.FUNCTIONAL,
        'medium',
        err
      ).addContext('component', 'ControlPanel')
       .addContext('function', 'handleStart');
      
      addError(error);
    }
  };

  const handleStop = () => {
    try {
      if (typeof onStop !== 'function') {
        throw new Error('Stop function is not available');
      }
      onStop();
    } catch (err) {
      const error = new AppError(
        'Failed to stop the breathing exercise. Please try again.',
        ErrorTypes.FUNCTIONAL,
        'medium',
        err
      ).addContext('component', 'ControlPanel')
       .addContext('function', 'handleStop');
      
      addError(error);
    }
  };

  const handleSkip = () => {
    try {
      if (typeof onSkip !== 'function') {
        throw new Error('Skip function is not available');
      }
      onSkip();
    } catch (err) {
      const error = new AppError(
        'Failed to skip to the next cycle. Please try again.',
        ErrorTypes.FUNCTIONAL,
        'low',
        err
      ).addContext('component', 'ControlPanel')
       .addContext('function', 'handleSkip');
      
      addError(error);
    }
  };

  // Handle animation errors
  const handleAnimationError = (element, error) => {
    const err = new AppError(
      `Animation error in ${element}: ${error?.message || 'Unknown animation error'}`,
      ErrorTypes.UI,
      'low',
      error
    ).addContext('component', 'ControlPanel')
     .addContext('element', element)
     .addContext('reducedMotion', prefersReducedMotion);
    
    addError(err);
  };

  const motionWhileHover = useMemo(() => prefersReducedMotion ? undefined : { scale: 1.05 }, [prefersReducedMotion]);
  const motionWhileTap = useMemo(() => prefersReducedMotion ? undefined : { scale: 0.95 }, [prefersReducedMotion]);

  return (
    <div className="control-container" role="region" aria-label="Breathing controls">
      <div className="cycle-selector">
        <label htmlFor="cycles">Cycles: </label>
        <select
          id="cycles"
          value={totalCycles}
          onChange={handleCycleChange}
          disabled={isActive}
          aria-disabled={isActive}
          aria-describedby="cyclesHelp"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
        <span id="cyclesHelp" className="sr-only">Choose number of cycles between 1 and 10</span>
      </div>
      
      <div className="button-container" role="group" aria-label="Session controls">
        {!isActive ? (
          <motion.button
            className="button start-button"
            whileHover={motionWhileHover}
            whileTap={motionWhileTap}
            onClick={handleStart}
            onError={(err) => handleAnimationError('start-button', err)}
            aria-pressed="false"
          >
            Start
          </motion.button>
        ) : (
          <div className="active-buttons">
            <motion.button
              className="button stop-button"
              whileHover={motionWhileHover}
              whileTap={motionWhileTap}
              onClick={handleStop}
              onError={(err) => handleAnimationError('stop-button', err)}
              aria-pressed="true"
            >
              Stop
            </motion.button>
            <motion.button
              className="button skip-button"
              whileHover={motionWhileHover}
              whileTap={motionWhileTap}
              onClick={handleSkip}
              onError={(err) => handleAnimationError('skip-button', err)}
              aria-pressed="false"
            >
              Skip
            </motion.button>
          </div>
        )}
      </div>
      
      <p className="info-text">
        The 4-7-8 breathing technique is a breathing pattern developed by Dr. Andrew Weil.
        It's based on pranayama, an ancient yogic practice that helps with breath control.
      </p>
    </div>
  )
}

export default ControlPanel