import React, { useMemo, useCallback } from 'react';
import { createMarkdownToReactParser } from '@coseeing/see-mark';

import { useBindModalLinkEffect } from '@/lib/link';
import { useConfigContext } from '@/lib/context/config';

import Alert from './Alert';
import InternalLink from './InternalLink';

function Content() {
  const {
    data: { latexDelimiter, documentFormat, sourceText, images },
  } = useConfigContext();

  useBindModalLinkEffect();

  const seeMarkReactParse = useSeeMarkParse({
    latexDelimiter,
    documentFormat,
    imageFiles: images,
  });

  // TODO: fulfill what linkHandler does
  const content = useMemo(() => {
    return seeMarkReactParse(sourceText);
  }, [sourceText, seeMarkReactParse]);

  return (
    <div className="markdown">
      <div data-remove-styles>
        <div>{content}</div>
      </div>
    </div>
  );
}

export default Content;

const useSeeMarkParse = ({ latexDelimiter, documentFormat, imageFiles }) => {
  const seeMarkReactParse = useCallback(
    (markdown) => {
      return createMarkdownToReactParser({
        options: {
          latexDelimiter,
          documentFormat,
          imageFiles,
        },
        components: { alert: Alert, internalLink: InternalLink },
      })(markdown);
    },
    [imageFiles, latexDelimiter, documentFormat],
  );

  return seeMarkReactParse;
};
