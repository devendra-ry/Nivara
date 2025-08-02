import { motion } from 'framer-motion'
import './ControlPanel.css'

const ControlPanel = ({ isActive, onStart, onStop, onSkip, totalCycles, onCycleChange }) => {
  return (
    <div className="control-container">
      <div className="cycle-selector">
        <label htmlFor="cycles">Cycles: </label>
        <select 
          id="cycles" 
          value={totalCycles} 
          onChange={(e) => onCycleChange(Number(e.target.value))}
          disabled={isActive}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      
      <div className="button-container">
        {!isActive ? (
          <motion.button
            className="button start-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
          >
            Start
          </motion.button>
        ) : (
          <div className="active-buttons">
            <motion.button
              className="button stop-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStop}
            >
              Stop
            </motion.button>
            <motion.button
              className="button skip-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSkip}
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