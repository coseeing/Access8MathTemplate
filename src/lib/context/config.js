import React, { createContext, useContext, useState } from 'react';

import exampleConfig from './example-config';

const STATUS = {
  IDEL: 'IDEL',
  FETCHING: 'FETCHING',
  SUCCESSFUL: 'SUCCESSFUL',
};

const ConfigContext = createContext();

export const CconfigContextProvider = ({ children }) => {
  const [status] = useState(STATUS.IDEL);
  const [config] = useState(exampleConfig);

  const value = { config, status };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

export const useConfigContext = () => {
  return useContext(ConfigContext);
};
