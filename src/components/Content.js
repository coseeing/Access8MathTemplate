import React, { useMemo } from 'react';
import { markedProcessorFactory } from '@coseeing/see-mark';

import linkHandler, { useBindModalLinkEffect } from '@/lib/link';
import { useConfigContext } from '@/lib/context/config';

function Content() {
  const {
    data: { latexDelimiter, documentFormat, sourceText },
  } = useConfigContext();

  useBindModalLinkEffect();

  const markedFunc = useMemo(() => {
    return markedProcessorFactory({
      latexDelimiter: latexDelimiter,
      asciimathDelimiter: 'graveaccent',
      htmlMathDisplay: documentFormat,
    });
  }, [latexDelimiter, documentFormat]);

  const markdownHTML = useMemo(() => {
    return linkHandler(markedFunc(sourceText));
  }, [sourceText, markedFunc]);

  return (
    <div className="markdown">
      <div data-remove-styles>
        <div
          dangerouslySetInnerHTML={{
            __html: markdownHTML,
          }}
        />
      </div>
    </div>
  );
}

export default Content;
