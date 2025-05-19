import styled from 'styled-components';
import { motion } from 'framer-motion';

const MeterContainer = styled.div`
  position: relative;
  width: 100%;
  height: 20px;
  background: #002200;
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #0f0, #0ff);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: shine 2s infinite;
  }
`;

const ProgressMeter = ({ progress }) => (
  <MeterContainer>
    <ProgressFill
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.5 }}
    />
  </MeterContainer>
);

export default ProgressMeter;