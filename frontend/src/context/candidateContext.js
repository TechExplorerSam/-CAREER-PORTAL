// CandidateContext.js
import React, { createContext, useState } from 'react';

// Create a context for candidate data
export const CandidateContext = createContext();

// Create a provider component
export const CandidateProvider = ({ children }) => {
  const [candidate, setCandidate] = useState(null);
  const [isFullyRead, setIsFullyRead] = useState(false);

  return (
    <CandidateContext.Provider value={{ candidate, setCandidate, isFullyRead, setIsFullyRead }}>
      {children}
    </CandidateContext.Provider>
  );
};

