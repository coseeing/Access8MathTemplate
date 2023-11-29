import React, { createContext, useContext } from 'react';
import useSWRImmutable from 'swr/immutable';

const fetcher = (url) => {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    })
    .then((data) => {
      console.log('config', data);
      return data;
    })
    .catch((error) => {
      console.log('An error occurred:', error);
    });
};

const ConfigContext = createContext();

export const CconfigContextProvider = ({ children }) => {
  const { data, error, isLoading } = useSWRImmutable(
    '/content-config.json',
    fetcher,
  );

  const value = { config: data, error, isLoading };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

export const useConfigContext = () => {
  return useContext(ConfigContext);
};

export default ConfigContext;
