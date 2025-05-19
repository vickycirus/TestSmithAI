import { motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';

const ResultsContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  background: rgba(0, 10, 0, 0.9);
  border: 3px solid #0f0;
  border-radius: 12px;
`;

const ResultsSection = styled.div`
  margin: 2rem 0;
  padding: 1rem;
  border: 2px solid;
  border-radius: 8px;

  &.success {
    border-color: #0f0;
    background: rgba(0, 20, 0, 0.3);
  }

  &.failure {
    border-color: #f00;
    background: rgba(20, 0, 0, 0.3);
  }
`;

const ResultItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  margin: 0.5rem 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
`;

const StatusBadge = styled.span`
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.9rem;

  &.success {
    background: #0f0;
    color: #000;
    text-shadow: 0 0 5px #0f0;
  }

  &.failed {
    background: #f00;
    color: #fff;
    text-shadow: 0 0 5px #f00;
  }
`;

const SectionTitle = styled.h3`
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: ${props => props.success ? '#0f0' : '#f00'};
  text-shadow: 0 0 10px ${props => props.success ? '#0f0' : '#f00'};
`;

const ResultsPage = ({ files = {} }) => {
  const successFiles = Object.entries(files).filter(([_, f]) => f?.status === 'success');
  const failedFiles = Object.entries(files).filter(([_, f]) => f?.status === 'failed');

  return (
    <ResultsContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="cyber-title glitch">MISSION SUMMARY</h2>
      
      <ResultsSection className="success">
        <SectionTitle success>✅ SUCCESSFUL OPERATIONS ({successFiles.length})</SectionTitle>
        {successFiles.map(([filename, _]) => (
          <ResultItem key={filename}>
            <span className="filename">{filename}</span>
            <StatusBadge className="success">PASSED</StatusBadge>
          </ResultItem>
        ))}
      </ResultsSection>

      <ResultsSection className="failure">
        <SectionTitle>❌ FAILED OPERATIONS ({failedFiles.length})</SectionTitle>
        {failedFiles.map(([filename, data]) => (
          <ResultItem key={filename}>
            <span className="filename">{filename}</span>
            <StatusBadge className="failed">
              {data?.messages?.length > 0
                ? data.messages[data.messages.length - 1]
                : 'UNKNOWN ERROR'}
            </StatusBadge>
          </ResultItem>
        ))}
      </ResultsSection>
    </ResultsContainer>
  );
};

export default ResultsPage;