import React, { useMemo } from 'react';

import {
  textProcessorFactory,
  markedProcessorFactory,
} from '@/lib/shared/index';

import linkHandler, { useBindModalLinkEffect } from '@/lib/link';
import { useConfigContext } from '@/lib/context/config';

function Content() {
  const {
    data: { latexDelimiter, display, sourceText, documentDisplay },
  } = useConfigContext();

  useBindModalLinkEffect();

  const content = useMemo(() => {
    const processor = textProcessorFactory({
      latexDelimiter,
      htmlMathDisplay: display,
      asciimathDelimiter: 'graveaccent',
    });
    return processor(sourceText);
  }, [sourceText, latexDelimiter, display]);

  const markedFunc = useMemo(() => {
    return markedProcessorFactory({
      latexDelimiter: latexDelimiter,
      asciimathDelimiter: 'graveaccent',
      htmlMathDisplay: display,
    });
  }, [latexDelimiter, display]);

  const markdownHTML = useMemo(() => {
    return linkHandler(markedFunc(sourceText));
  }, [sourceText, markedFunc]);

  if (documentDisplay === 'markdown') {
    return (
      <div className="markdown">
        <span>
          <span
            dangerouslySetInnerHTML={{
              __html: markdownHTML,
            }}
          />
        </span>
      </div>
    );
  }

  return (
    <div>
      {content.map((line, index) => {
        return (
          <span key={index}>
            <span dangerouslySetInnerHTML={{ __html: line }} />
          </span>
        );
      })}
    </div>
  );
}

export default Content;
