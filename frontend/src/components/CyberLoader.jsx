import { motion } from 'framer-motion';
import styled from 'styled-components';

const LoaderContainer = styled(motion.div)`
  position: relative;
  width: 200px;
  height: 200px;
  margin: 2rem auto;
  
  .outer-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 4px solid #0f0;
    box-shadow: 0 0 30px #0f03;
    animation: rotate 3s linear infinite;
  }
  
  .progress-fill {
    position: absolute;
    width: 100%;
    height: 100%;
    clip-path: inset(0 ${props => 100 - props.progress}% 0 0);
    
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: conic-gradient(#0f0, #0ff, #0f0);
    }
  }
`;

const CyberLoader = ({ progress }) => (
  <LoaderContainer progress={progress}>
    <div className="outer-ring" />
    <div className="progress-fill" />
    {/* <div className="scanline-overlay" /> */}
  </LoaderContainer>
);

export default CyberLoader;