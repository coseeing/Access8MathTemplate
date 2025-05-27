import React, { useMemo } from 'react';

import {
  textProcessorFactory,
  markedProcessorFactory,
} from '@coseeing/see-mark';

import linkHandler, { useBindModalLinkEffect } from '@/lib/link';
import { useConfigContext } from '@/lib/context/config';

function Content() {
  const {
    data: { latexDelimiter, documentFormat, sourceText, documentDisplay },
  } = useConfigContext();

  useBindModalLinkEffect();

  const content = useMemo(() => {
    const processor = textProcessorFactory({
      latexDelimiter,
      htmlMathDisplay: documentFormat,
      asciimathDelimiter: 'graveaccent',
    });
    return processor(sourceText);
  }, [sourceText, latexDelimiter, documentFormat]);

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

  if (documentDisplay === 'markdown') {
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
