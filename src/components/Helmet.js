import React from 'react';
import { Helmet as HelmetComponent } from 'react-helmet';

import { useConfigContext } from '@/lib/context/config';

const Helmet = () => {
  const {
    data: { title },
  } = useConfigContext();

  return (
    <HelmetComponent>
      <title>{title}</title>
      <meta name="description" content={title} />
      <meta name="keywords" content={title} />
    </HelmetComponent>
  );
};

export default Helmet;
