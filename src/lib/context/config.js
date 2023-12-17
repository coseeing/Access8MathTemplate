import React, { createContext, useContext } from 'react';
import useSWRImmutable from 'swr/immutable';

const jsonFetcher = (url) => {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    })
    .then((data) => {
      console.log('data', data);
      return data;
    })
    .catch((error) => {
      console.log('An error occurred:', error);
    });
};

const fetcher = (url) => {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.text();
    })
    .then((data) => {
      console.log('data', data);
      return data;
    })
    .catch((error) => {
      console.log('An error occurred:', error);
    });
};

const ConfigContext = createContext();

const useFetchConfig = () => {
  const {
    data: config,
    error: configError,
    isLoading: isConfigLoading,
  } = useSWRImmutable('/content-config.json', jsonFetcher);

  const {
    data: sourceText,
    error: sourceError,
    isLoading: isSourceLoading,
  } = useSWRImmutable('/source.txt', fetcher);

  if (isConfigLoading || isSourceLoading) {
    return { data: null, error: null, isLoading: true };
  }

  if (configError) {
    return { data: null, error: configError, isLoading: false };
  }

  if (sourceError) {
    return { data: null, error: sourceError, isLoading: false };
  }

  if (config && sourceText) {
    return {
      data: { ...config, raw: sourceText },
      error: null,
      isLoading: false,
    };
  }

  return {
    data: null,
    error: new Error('unexpected config fetcher error'),
    isLoading: false,
  };
};

export const CconfigContextProvider = ({ children }) => {
  const value = useFetchConfig();

  console.log('value', value);

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

export const useConfigContext = () => {
  return useContext(ConfigContext);
};

export default ConfigContext;
