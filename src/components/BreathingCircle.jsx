import { useMemo } from 'react'
import { motion } from 'framer-motion'
import './BreathingCircle.css'

const BreathingCircle = ({ state }) => {
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const circleVariants = useMemo(() => ({
    idle: {
      scale: 1,
      opacity: 0.8,
      transition: {
        duration: prefersReducedMotion ? 0 : 1.5,
        ease: 'easeInOut'
      }
    },
    inhale: {
      scale: 1.4,
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    hold: prefersReducedMotion
      ? { scale: 1.4, opacity: 1, transition: { duration: 0 } }
      : {
          scale: [1.4, 1.42, 1.4],
          opacity: 1,
          transition: {
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }
        },
    exhale: {
      scale: 1,
      opacity: 0.8,
      transition: {
        duration: prefersReducedMotion ? 0 : 8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }), [prefersReducedMotion]);

  const ringAriaLabel =
    state === 'idle' ? 'Breathing circle idle'
    : state === 'inhale' ? 'Breathing circle inhale animation'
    : state === 'hold' ? 'Breathing circle hold animation'
    : 'Breathing circle exhale animation';

  const progressRingAriaLabel = `Progress ring showing ${state} phase`;

  return (
    <div className="circle-container" role="group" aria-label="Breathing visualizer">
      <div className="progress-ring-container">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={progressRingAriaLabel}
        >
          <defs>
            <linearGradient id="progressGradientInhale" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--primary-color)" />
              <stop offset="100%" stopColor="var(--secondary-color)" />
            </linearGradient>
            <linearGradient id="progressGradientHold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--secondary-color)" />
              <stop offset="100%" stopColor="var(--accent-color)" />
            </linearGradient>
            <linearGradient id="progressGradientExhale" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-color)" />
              <stop offset="100%" stopColor="var(--light-text-color)" />
            </linearGradient>
          </defs>

          <motion.circle
            className={`progress-ring ${state}`}
            cx="50"
            cy="50"
            r="45"
            strokeDasharray="283"
            strokeDashoffset="283"
            animate={{
              strokeDashoffset: state === 'idle' ? 283 : 0
            }}
            transition={{
              duration: prefersReducedMotion
                ? 0
                : state === 'inhale' ? 4 :
                  state === 'hold' ? 7 :
                  state === 'exhale' ? 8 : 1,
              ease: 'linear'
            }}
          />
        </svg>
      </div>

      {state === 'exhale' && !prefersReducedMotion && (
        <>
          <motion.div
            className="ripple-effect"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 6, ease: 'easeOut' }}
            aria-hidden="true"
          />
          <motion.div
            className="ripple-effect secondary"
            initial={{ scale: 1, opacity: 0.4 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 7, ease: 'easeOut', delay: 1 }}
            aria-hidden="true"
          />
          <motion.div
            className="ripple-effect tertiary"
            initial={{ scale: 1, opacity: 0.2 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 8, ease: 'easeOut', delay: 2 }}
            aria-hidden="true"
          />
        </>
      )}

      <motion.div
        className={`outer-ring ${state}`}
        animate={state}
        variants={circleVariants}
        role="img"
        aria-label={ringAriaLabel}
      >
        <div className="inner-circle" aria-hidden="true" />
      </motion.div>
    </div>
  )
}

export default BreathingCircle