import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CyberLoader from './components/CyberLoader';
import FileCard from './components/FileCard';
import HackingTerminal from './components/HackingTerminal';
import { startProcessing } from './utils/api';
import './styles/global.css';
import './styles/animations.css';
import { playAlert, playSuccess } from './utils/sounds';

const App = () => {
const [status, setStatus] = useState({
  globalProgress: 0,
  totalFiles: 0,
  files: {} 
});
  const [messages, setMessages] = useState([]);
  const [repoPath, setRepoPath] = useState('');

useEffect(() => {
  const eventSource = new EventSource('http://localhost:8000/events');
  
  eventSource.onmessage = (e) => {
    try {
      const event = JSON.parse(e.data);
      
      if (event.filename !== "global" && !status.files[event.filename]) {
        setStatus(prev => ({
          ...prev,
          totalFiles: prev.totalFiles + 1,
          files: {
            ...prev.files,
            [event.filename]: {
              progress: 0,
              retries: 0,
              milestones: {
                prompt: false,
                fetch: false,
                run: false,
                success: false
              },
              messages: [],
              ...event.data
            }
          }
        }));
      }
      else if (event.filename !== "global") {
        setStatus(prev => ({
          ...prev,
          files: {
            ...prev.files,
            [event.filename]: {
              ...prev.files[event.filename],
              ...event.data,
              messages: [
                ...prev.files[event.filename].messages,
                ...(event.data.messages || [])
              ]
            }
          }
        }));
      }
      else {
        setStatus(prev => ({
          ...prev,
          globalProgress: event.data.progress || 0
        }));
      }
    } catch (error) {
      console.error('Error parsing event:', error);
    }
  };

  return () => eventSource.close();
}, []);

  const initiateSequence = async () => {
    setMessages([`INITIALIZING SEQUENCE FOR: ${repoPath}`]);
      playAlert();
    try {
      await startProcessing(repoPath);
      setMessages(prev => [...prev, 'PROTOCOL ENGAGED']);
    } catch {
      setMessages(prev => [...prev, 'INITIATION FAILED']);
    }
  };

  return (
    <div className="cyber-container">
     <div className="cyber-bg">
  <div className="static-overlay" />
</div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="main-frame"
      >
        <h1 className="cyber-title glitch">AI TEST AGENT v2.3.1</h1>

        <div className="input-panel">
          <input
            type="text"
            value={repoPath}
            onChange={(e) => setRepoPath(e.target.value)}
            placeholder="ENTER TARGET REPOSITORY PATH"
            className="cyber-input"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cyber-button"
            onClick={initiateSequence}
          >
            INITIATE PROTOCOL
          </motion.button>
        </div>

        <div className="status-display">
          <CyberLoader progress={status.globalProgress} />
          <div className="global-progress">
            <div className="progress-bar glitch" style={{ width: `${status.globalProgress}%` }}>
              <span className="progress-text">{status.globalProgress}%</span>
            </div>
          </div>
        </div>

        <HackingTerminal messages={messages} />

        <div className="file-grid">
          <AnimatePresence>
            {Object.entries(status.files).map(([filename, fileStatus]) => (
              <FileCard 
                key={filename}
                filename={filename}
                status={fileStatus}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default App;