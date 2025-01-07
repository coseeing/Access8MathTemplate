const LINK_REGEXP = /^\[([^\]]+)\]<([^>]+)>/;
const QUOTE_REGEXP = /^\[!LINK\]#([^\s]+)\n/;

const LINK_COLOR = "text-[#58B2DC]"
const QUOTE_BORDER_COLOR = "border-[#81C7D4]"

function createValidFirstTokens(token) {
  return token && token.type !== 'br' ? [token] : [];
}

function createProcessedFirstLine(firstLine) {
  const [patternToken, firstToken, ...remainingTokens] = firstLine.tokens;
  
  return {
    ...firstLine,
    tokens: [
      {
        ...patternToken,
        raw: patternToken.raw.replace(QUOTE_REGEXP, ''),
        text: patternToken.text.replace(QUOTE_REGEXP, '')
      },
      ...createValidFirstTokens(firstToken),
      ...remainingTokens
    ]
  };
}

function markedInternalLink() {
  return {
    walkTokens(token) {
      if (token.type !== 'blockquote') return;

      if (!Array.isArray(token.tokens)) return;

      const [firstLine, ...remainingLines] = token.tokens;
      const firstLineText = firstLine?.text || '';
      
      const match = firstLineText.match(QUOTE_REGEXP);

      if (!match) return;

      const id = match[1];
      
      Object.assign(token, {
        type: 'internalLink-quote',
        meta: {
          id,
        },
      });

      token.tokens = [
        createProcessedFirstLine(firstLine),
        ...remainingLines,
      ]
    },
    extensions: [
      {
        name: 'internalLink-link',
        level: 'inline',
        start(src) {
          return src.match(/\[/)?.index;
        },
        tokenizer(src) {
          const match = src.match(LINK_REGEXP);
          
          if (match) {
            return {
              type: 'internalLink-link',
              raw: match[0],
              text: match[1],
              id: match[2],
            };
          }
        },
        renderer(token) {
          return `<a href="/#${token.id}" id="${token.id}-source" class="underline ${LINK_COLOR}">${token.text}</a>`;
        }
      },
      {
        name: 'internalLink-quote',
        level: 'block',
        renderer({ meta, tokens = [] }) {
          return `
            <div
              id="${meta.id}"
              role="region"
              aria-label="Supplementary Information"
              class="px-4 mb-4 border-l-4 ${QUOTE_BORDER_COLOR}"
            >
              ${this.parser.parse(tokens)}
              <a href="/#${meta.id}-source" class="underline ${LINK_COLOR}">返回</a>
            </div>
          `;
        }
      },
    ],
  };
}

module.exports = markedInternalLink;
