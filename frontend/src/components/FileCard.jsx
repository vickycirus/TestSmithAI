import { motion } from 'framer-motion';
import styled from 'styled-components';

const Card = styled(motion.div)`
  background: rgba(0, 20, 0, 0.8);
  border: 2px solid #0f0;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      #0ff3,
      transparent
    );
    animation: rotate 4s linear infinite;
  }
`;

const statusColors = {
  discovered: '#666',
  processing: '#0f0',
  retrying: '#ff0',
  success: '#0f0',
  failed: '#f00'
}


const StatusBar = styled.div`
  height: 8px;
  background: #002200;
  border-radius: 4px;
  margin: 1rem 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: linear-gradient(90deg, #0f0, #0ff);
    transition: width 0.5s ease;
  }
`;

const FileCard = ({ filename, status= {} }) => {
    const safeStatus = {
    status: 'pending',
    progress: 0,
    retries: 0,
    milestones: {},
    messages: [],
    ...status 
  };
  return(
  <Card
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="file-card"
  >
    <div className="file-header">
      <span className="filename">{filename}</span>
      <span>    </span>
      <span className={`status ${status.status}`} style={{ color: statusColors[safeStatus.status] }} >
  {safeStatus.status?.toUpperCase?.() || 'PENDING'}
        </span>
    </div>
    
    <StatusBar progress={status.progress} />
    
  
    <div className="milestones">
        {['prompt', 'fetch', 'run', 'success'].map((key) => (
          <div key={key} className={`milestone ${safeStatus.milestones[key] ? 'active' : ''}`}>
            <div className="milestone-dot" />
            <span>{key.toUpperCase()}</span>
            {key === 'run' && safeStatus.retries > 0 && (
              <span className="retry-badge">RETRY {safeStatus.retries}/3</span>
            )}
          </div>
        ))}
      </div>
    {status.retries > 0 && (
      <div className="retry-counter">
        <span>RETRY PROTOCOL {status.retries}/3</span>
        <div className="retry-animation" />
      </div>
    )}
  </Card>
);
};
export default FileCard;