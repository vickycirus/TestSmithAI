import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useEffect, useRef } from 'react';

const TerminalContainer = styled.div`
  background: rgba(0, 10, 0, 0.9);
  border: 2px solid #0f0;
  border-radius: 8px;
  padding: 1rem;
  font-family: 'Courier New', monospace;
  color: #0f0;
  height: 300px;
  overflow-y: auto;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 255, 0, 0.1) 0%,
      transparent 50%,
      rgba(0, 255, 0, 0.1) 100%
    );
    pointer-events: none;
    animation: scanline 2s linear infinite;
  }
`;

const TerminalLine = styled(motion.div)`
  padding: 0.5rem;
  border-left: 3px solid ${props => 
    props.type === 'error' ? '#f00' : 
    props.type === 'success' ? '#0f0' : '#0ff'};
  margin: 0.5rem 0;
  background: rgba(0, 20, 0, 0.3);
  
  &::before {
    content: '${props => 
      props.type === 'error' ? '❌' : 
      props.type === 'success' ? '✅' : 'ℹ️'}';
    margin-right: 1rem;
    filter: hue-rotate(${props => props.type === 'error' ? '180deg' : '0deg'});
  }
`;

const HackingTerminal = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <TerminalContainer className="terminal">

      <AnimatePresence>
        {messages.map((msg, i) => (
          <TerminalLine
            key={i}
            type={msg.type}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {msg.text}
          </TerminalLine>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </TerminalContainer>
  );
};

export default HackingTerminal;