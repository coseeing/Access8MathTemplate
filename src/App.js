import React from 'react';

import Content from '@/components/Content';
import Helmet from '@/components/Helmet';
import ConfigContext, { CconfigContextProvider } from '@/lib/context/config';

function App() {
  return (
    <CconfigContextProvider>
      <div id="app" className="theme">
        <ConfigContext.Consumer>
          {({ data, isLoading }) => {
            if (data) {
              return (
                <>
                  <Helmet />
                  <Content />
                </>
              );
            }
            if (isLoading) {
              return <div>loading</div>;
            }

            return <div>Something wrong</div>;
          }}
        </ConfigContext.Consumer>
      </div>
    </CconfigContextProvider>
  );
}

export default App;
