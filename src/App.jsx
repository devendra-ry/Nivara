import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import BreathingCircle from './components/BreathingCircle'
import ControlPanel from './components/ControlPanel'

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
    <AppContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {error && (
        <ErrorMessage>
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </ErrorMessage>
      )}
      <Title>Mindful Breathing</Title>
      <Subtitle>4-7-8 Technique</Subtitle>
      
      <MainContent>
        <BreathingCircle state={breathingState} />
        
        <AnimatePresence mode="wait">
          <InstructionText
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
          </InstructionText>
        </AnimatePresence>
        
        <ProgressText
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isActive && `Cycle ${cycles + 1} of ${totalCycles}`}
        </ProgressText>
        
        <ControlPanel 
          isActive={isActive}
          onStart={handleStart}
          onStop={handleStop}
          totalCycles={totalCycles}
          onCycleChange={handleCycleChange}
        />
      </MainContent>
    </AppContainer>
  )
}

// Add new styled component
const ErrorMessage = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: rgba(255, 0, 0, 0.2);
  padding: 15px;
  border-radius: 8px;
  display: flex;
  gap: 10px;
  align-items: center;
  
  button {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
  }
`

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
`

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
`

const Subtitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
`

const InstructionText = styled(motion.div)`
  font-size: 1.5rem;
  margin: 2rem 0;
  text-align: center;
  min-height: 2rem;
`

// Use motion.div for ProgressText (remove the duplicate declaration below)
const ProgressText = styled(motion.div)`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.8;
`

export default App
