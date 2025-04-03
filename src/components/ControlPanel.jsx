import { motion } from 'framer-motion'
import styled from 'styled-components'

const ControlPanel = ({ isActive, onStart, onStop, totalCycles, onCycleChange }) => {
  return (
    <ControlContainer>
      <CycleSelector>
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
      </CycleSelector>
      
      <ButtonContainer>
        {!isActive ? (
          <StartButton 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
          >
            Start
          </StartButton>
        ) : (
          <StopButton 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStop}
          >
            Stop
          </StopButton>
        )}
      </ButtonContainer>
      
      <InfoText>
        The 4-7-8 breathing technique is a breathing pattern developed by Dr. Andrew Weil. 
        It's based on pranayama, an ancient yogic practice that helps with breath control.
      </InfoText>
    </ControlContainer>
  )
}

const ControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
`

const CycleSelector = styled.div`
  margin-bottom: 1.5rem;
  
  select {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 4px;
    color: white;
    padding: 5px 10px;
    margin-left: 10px;
    cursor: pointer;
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
`

const ButtonContainer = styled.div`
  margin-bottom: 1.5rem;
`

const Button = styled(motion.button)`
  padding: 12px 30px;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`

const StartButton = styled(Button)`
  background: linear-gradient(to right, #00b09b, #96c93d);
`

const StopButton = styled(Button)`
  background: linear-gradient(to right, #ff416c, #ff4b2b);
`

const InfoText = styled.p`
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.8;
  max-width: 400px;
  line-height: 1.5;
`

export default ControlPanel