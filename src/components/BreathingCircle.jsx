import { motion } from 'framer-motion'
import styled from 'styled-components'

const BreathingCircle = ({ state }) => {
  const circleVariants = {
    idle: {
      scale: 1,
      opacity: 0.7,
      transition: { 
        duration: 1,
        ease: "easeInOut"
      }
    },
    inhale: {
      scale: 1.5,
      opacity: 1,
      transition: { 
        duration: 4,
        ease: [0.4, 0, 0.2, 1] // Custom cubic-bezier for smoother expansion
      }
    },
    hold: {
      scale: 1.5,
      opacity: 1,
      transition: { 
        duration: 7,
        ease: "linear"
      }
    },
    exhale: {
      scale: 1,
      opacity: 0.7,
      transition: { 
        duration: 8,
        ease: [0.4, 0, 0.2, 1] // Same smooth curve for contraction
      }
    }
  }

  // Color variants based on breathing state
  const getCircleColor = () => {
    switch (state) {
      case 'inhale':
        return '#64B5F6' // Blue for inhale
      case 'hold':
        return '#81C784' // Green for hold
      case 'exhale':
        return '#FFB74D' // Orange for exhale
      default:
        return '#B39DDB' // Purple for idle
    }
  }

  return (
    <CircleContainer>
      <ProgressRingContainer>
        <svg width="300" height="300" viewBox="0 0 100 100">
          <ProgressRing 
            cx="50"
            cy="50"
            r="45"
            strokeDasharray="283"
            strokeDashoffset="283"
            animate={{
              strokeDashoffset: state === 'idle' ? 283 : 
                               state === 'inhale' ? 200 : 
                               state === 'hold' ? 100 : 0
            }}
            transition={{
              duration: state === 'inhale' ? 4 : 
                        state === 'hold' ? 7 : 
                        state === 'exhale' ? 8 : 1,
              ease: "easeInOut"
            }}
          />
        </svg>
      </ProgressRingContainer>
      
      {state === 'exhale' && (
        <RippleEffect
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 8, ease: "easeOut" }}
        />
      )}
      
      <OuterRing
        animate={state}
        variants={circleVariants}
        style={{ backgroundColor: getCircleColor() }}
      >
        <InnerCircle />
      </OuterRing>
    </CircleContainer>
  )
}

// Add a container for the progress ring
const ProgressRingContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  z-index: 1;
`

// Update ProgressRing styling
const ProgressRing = styled(motion.circle)`
  fill: none;
  stroke: rgba(255, 255, 255, 0.3);
  stroke-width: 2;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
`

// Update CircleContainer to ensure proper positioning
const CircleContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 300px;
  margin: 0 auto;
`

const OuterRing = styled(motion.div)`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 3;
`

const InnerCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
`

const RippleEffect = styled(motion.div)`
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  z-index: 0;
`

export default BreathingCircle