import React, { createContext, useContext } from 'react';

const ConfigContext = createContext();

const useFetchConfig = () => {
  const isServerSide = typeof window === 'undefined';

  if (isServerSide) {
    return {
      data: null,
      error: new Error("It's on server side"),
    };
  }

  if (!window.contentConfig) {
    return {
      data: null,
      error: new Error('no contentConfig'),
    };
  }

  const config = window.contentConfig;

  return {
    data: config,
    error: null,
  };
};

export const CconfigContextProvider = ({ children }) => {
  const value = useFetchConfig();

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

export const useConfigContext = () => {
  return useContext(ConfigContext);
};

export default ConfigContext;
