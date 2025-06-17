const latexDelimiterConvertor = require('./content-processor/latext-delimiter-convertor');

const createMarkdownParser = ({
  options = {
    latexDelimiter: null,
    asciimathDelimiter: null,
    htmlMathDisplay: null,
    imageFiles: null,
  },
  components,
}) => {
  const parseMarkdown = () => {
    // use options and components
    console.log('Options:', options);
    console.log('Components:', components);
  };

  return parseMarkdown;
};

// deprecate textProcessorFactory
module.exports = {
  // rename to createMarkdownParser
  createMarkdownParser,
  latexDelimiterConvertor,
};

// demo for createMarkdownParser
const CustomImage = ({ src, alt }) => {
  return `<img src="${src}" alt="${alt}" />`;
};

const CustomAlertSection = ({ title, content }) => {
  return `<div class="alert-section">
    <h2>${title}</h2>
    <p>${content}</p>
  </div>`;
};

const markdownContent = `# Hello World`;

const options = {
  latexDelimiter: 'bracket',
  asciimathDelimiter: 'graveaccent',
  htmlMathDisplay: 'block',
  imageFiles: [],
};

const components = {
  Image: CustomImage,
  AlertSection: CustomAlertSection,
};

const parseMarkdown = createMarkdownParser({ options, components });
const parsedContent = parseMarkdown(markdownContent);
