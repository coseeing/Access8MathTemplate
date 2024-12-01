const { Marked } = require('marked');

const latex2mmlFactory = require('./tex-to-mml');
const asciimath2mmlFactory = require('./ascii-math-to-mml');
const mml2svg = require('./mml-to-svg');

const LaTeX_delimiter_dict = {
  latex: {
    start: '\\\\\\l',
    end: '\\\\\\l',
    type: 'latex',
  },
  bracket: {
    start: '\\\\\\(',
    end: '\\\\\\)',
    type: 'latex',
  },
  dollar: {
    start: '\\$',
    end: '\\$',
    type: 'latex',
  },
};

const AsciiMath_delimiter_dict = {
  asciimath: {
    start: '\\\\\\a',
    end: '\\\\\\a',
    type: 'asciimath',
  },
  graveaccent: {
    start: '`',
    end: '`',
    type: 'asciimath',
  },
};

function processImagePaths(text, imageFiles) {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;

  const replaceImagePath = (fullMatch, alt, imagePath) => {
    try {
      if (!imageFiles) {
        return processForHtmlRender(alt, imagePath);
      }
      return processForEditorPreview(fullMatch, alt, imagePath, imageFiles);
    } catch (error) {
      console.error('Error processing image:', error);
      return fullMatch;
    }
  };

  const processForHtmlRender = (alt, imagePath) => {
    const imageName = imagePath.split('/').pop();
    const imageExt = window.contentConfig.imageFileName?.[imageName] || imageName;
    return `![${alt}](./images/${imageExt})`;
  };

  const processForEditorPreview = (fullMatch, alt, imagePath, imageFiles) => {
    const imageFile = imageFiles[imagePath];
    if (!imageFile) return fullMatch;
    const blobUrl = URL.createObjectURL(imageFile);
    return `![${alt}](${blobUrl})`;
  };

  return text.replace(imageRegex, replaceImagePath);
}

const markedProcessorFactory = ({
  latexDelimiter,
  asciimathDelimiter,
  htmlMathDisplay,
  imageFiles,
}) => {
  const asciimath2mml = asciimath2mmlFactory({ htmlMathDisplay });
  const latex2mml = latex2mmlFactory({ htmlMathDisplay });

  const LaTeX_delimiter = LaTeX_delimiter_dict[latexDelimiter];
  const AsciiMath_delimiter = AsciiMath_delimiter_dict[asciimathDelimiter];

  const latex_restring = `(?<=[^\\\\]?)${LaTeX_delimiter.start}(.*?[^\\\\])?${LaTeX_delimiter.end}`;
  const asciimath_restring = `(?<=[^\\\\]?)${AsciiMath_delimiter.start}(.*?[^\\\\])?${AsciiMath_delimiter.end}`;
  const reTexMath = new RegExp(
    `(.*?)(${latex_restring}|${asciimath_restring})`,
    's',
  );

  const latex_start_restring = `(?<=[^\\\\]?)${LaTeX_delimiter.start}`;
  const asciimath_start_restring = `(?<=[^\\\\]?)${AsciiMath_delimiter.start}`;
  const reTexMath_start = new RegExp(
    `${latex_start_restring}|${asciimath_start_restring}`,
  );

  const math = {
    name: 'math',
    level: 'inline', // Is this a block-level or inline-level tokenizer?
    start(src) {
      const result = src.match(reTexMath_start);
      return result ? result.index : 0;
    }, // Hint to Marked.js to stop and check for a match
    tokenizer(src) {
      const match = reTexMath.exec(src);
      if (match) {
        const math = match[3] || match[4];
        const AsciiMath_delimiter_raw_start = AsciiMath_delimiter.start.replace(
          /\\\\\\/g,
          '\\',
        );
        let typed;
        if (match[2].startsWith(AsciiMath_delimiter_raw_start)) {
          typed = 'asciimath';
        } else {
          typed = 'latex';
        }
        return {
          type: 'math',
          typed,
          raw: match[0],
          text: this.lexer.inlineTokens(match[1]),
          math: math ? math.trim() : '',
          mathraw: match[2],
        };
      }
    },
    renderer(token) {
      let mathMl;
      if (token.typed === 'asciimath') {
        mathMl = asciimath2mml(token.math);
      } else {
        mathMl = latex2mml(token.math);
      }
      return `${this.parser.parseInline(
        token.text,
      )}<span class="sr-only">${mathMl}</span><span aria-hidden="true">${mml2svg(
        mathMl,
      )}</span>`;
    },
  };
  const renderer = {
    text(token) {
      if (token.tokens?.length > 0) {
        return this.parser.parseInline(token.tokens);
      }
      return token.text.replace(/\n/g, '<br />');
    },
  };

  const marked = new Marked();

  marked.use({
    extensions: [math],
    renderer,
  });

  return (raw) => {
    const processedText = processImagePaths(raw, imageFiles);
    return marked.parse(processedText);
  };
};

module.exports = markedProcessorFactory;
