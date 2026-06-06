import { renderToHtml } from '@coseeing/see-mark/html';

import alert from './components/alert';
import internalLink from './components/internal-link';

const setMeta = (name, content) => {
  let el = document.head.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const appEl = document.getElementById('app');
const config = window.contentConfig;

if (!config) {
  appEl.textContent = 'Something wrong';
} else {
  document.title = config.title;
  setMeta('description', config.title);
  setMeta('keywords', config.title);

  document.body.className =
    config.documentColor === 'dark' ? 'dark-theme' : 'light-theme';

  try {
    const html = renderToHtml(config.sourceText, {
      options: {
        latexDelimiter: config.latexDelimiter,
        documentFormat: config.documentFormat,
        imageFiles: config.images,
        shouldBuildImageObjectURL: false,
      },
      components: { alert, internalLink },
    });

    // index.css targets the .markdown > [data-remove-styles] wrapper. The
    // HTML is sanitized by the adapter (escaped text, on* stripped,
    // javascript: URLs neutralized, <script>/<style> dropped), so assigning
    // it to innerHTML is safe here.
    appEl.innerHTML = `<div class="markdown"><div data-remove-styles><div>${html}</div></div></div>`;
  } catch (error) {
    appEl.textContent = `Render error: ${error && error.message}`;
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
