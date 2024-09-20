import React, { useEffect } from 'react';

import Content from '@/components/Content';
import Helmet from '@/components/Helmet';
import ConfigContext, { CconfigContextProvider } from '@/lib/context/config';
import { useConfigContext } from '@/lib/context/config';

function App() {
  const { data } = useConfigContext();

  useEffect(() => {
    if (data) {
      document.body.className = data.documentColor === 'dark' ? 'dark-theme' : 'light-theme';
    }
  }, [data]);
  return (
    <div id="app" className="theme">
      <ConfigContext.Consumer>
        {({ data }) => {
          if (data) {
            return (
              <>
                <Helmet />
                <Content />
              </>
            );
          }

          return <div>Something wrong</div>;
        }}
      </ConfigContext.Consumer>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <CconfigContextProvider>
      <App />
    </CconfigContextProvider>
  );
}
