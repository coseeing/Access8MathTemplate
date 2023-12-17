import React, { useMemo, useCallback } from 'react';

import { textmath2laObj } from '@/lib/content-processor/math-process';
import linkHandler from '@/lib/content-processor/link';
import { marked } from '@/lib/content-processor/markdown-process';
import latex2mmlFactory from '@/lib/content-processor/tex2mml';
import asciimath2mmlFactory from '@/lib/content-processor/am2mml';
import mml2svg from '@/lib/content-processor/mml2svg';
import { useConfigContext } from '@/lib/context/config';

function Content() {
  const {
    data: { latextDelimiter, display, raw, documentDisplay },
  } = useConfigContext();

  const markdownParser = useCallback(
    (data) => {
      return marked({
        latex_delimiter: latextDelimiter,
        asciimath_delimiter: 'graveaccent',
        display,
      })(data);
    },
    [latextDelimiter, display],
  );

  const textParser = useCallback(
    (text) => {
      return textmath2laObj({
        latex_delimiter: latextDelimiter,
        asciimath_delimiter: 'graveaccent',
      })(text);
    },
    [latextDelimiter],
  );

  const latexToMMLParser = useCallback(
    (data) => {
      return latex2mmlFactory({ display })(data);
    },
    [display],
  );

  const asciiMathToMMLParser = useCallback(
    (data) => {
      return asciimath2mmlFactory({ display })(data);
    },
    [display],
  );

  const content = useMemo(() => {
    return raw
      .replaceAll('\n\n', '\n')
      .split('\n')
      .map((line) => {
        return textParser(line).reduce((a, b) => {
          let result;
          if (b.type === 'latex-content') {
            result = `<span class="sr-only">${latexToMMLParser(
              b.data,
            )}</span><span aria-hidden="true">${mml2svg(
              latexToMMLParser(b.data),
            )}</span>`;
          } else if (b.type === 'asciimath-content') {
            result = `<span class="sr-only">${asciiMathToMMLParser(
              b.data,
            )}</span><span aria-hidden="true">${mml2svg(
              asciiMathToMMLParser(b.data),
            )}</span>`;
          } else {
            result = `<span>${b.data}</span>`;
          }
          return a + result;
        }, '');
      });
  }, [asciiMathToMMLParser, latexToMMLParser, raw, textParser]);

  const markdownHTML = useMemo(() => {
    return linkHandler(markdownParser(raw));
  }, [raw, markdownParser]);

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
            <br />
          </span>
        );
      })}
    </div>
  );
}

export default Content;
