import React, { createContext, useContext, useEffect, useState } from 'react';

// ParamsContext.js
export const ParamsContext = createContext();

export const ParamsProvider = ({ children }) => {
  const state = useState({});
  

  return (
    <ParamsContext.Provider value={state}>{children}</ParamsContext.Provider>
  );
};

export const useParams = () => useContext(ParamsContext);

//export { ParamsProvider, ParamsContext }