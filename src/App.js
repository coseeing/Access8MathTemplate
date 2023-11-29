import React from 'react';

import Content from '@/components/Content';
import Helmet from '@/components/Helmet';
import { CconfigContextProvider } from '@/lib/context/config';

function App() {
  return (
    <CconfigContextProvider>
      <div id="app" className="theme">
        <Helmet />
        <Content />
      </div>
    </CconfigContextProvider>
  );
}

export default App;
