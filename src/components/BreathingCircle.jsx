import { motion } from 'framer-motion'
import './BreathingCircle.css'

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
        return 'var(--primary-color)' // Forest green for inhale
      case 'hold':
        return 'var(--secondary-color)' // Sage for hold
      case 'exhale':
        return 'var(--light-text-color)' // Mint for exhale
      default:
        return 'var(--background-color)' // Cream for idle
    }
  }

  return (
    <div className="circle-container">
      <div className="progress-ring-container">
        <svg width="300" height="300" viewBox="0 0 100 100">
          <motion.circle 
            className="progress-ring"
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
      </div>
      
      {state === 'exhale' && (
        <motion.div
          className="ripple-effect"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 8, ease: "easeOut" }}
        />
      )}
      
      <motion.div
        className="outer-ring"
        animate={state}
        variants={circleVariants}
        style={{ backgroundColor: getCircleColor() }}
      >
        <div className="inner-circle" />
      </motion.div>
    </div>
  )
}

export default BreathingCircle