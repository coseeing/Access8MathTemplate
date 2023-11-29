import React, { createContext, useContext, useState } from 'react';

import exampleConfig from './example-config';

const ConfigContext = createContext(null);

export const CconfigContextProvider = ({ children }) => {
  const [value] = useState(exampleConfig);

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

export const useConfigContext = () => {
  return useContext(ConfigContext);
};
