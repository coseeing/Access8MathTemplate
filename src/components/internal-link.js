import { escapeHtml, escapeAttr } from '@coseeing/see-mark/html';

// Adds the template's blue link color on top of the default internal-link
// markup. Uses the see-mark 1.11 payload keys (display/target); the previous
// React component used the older text/id keys, which no longer match.
const internalLink = ({ display = '', target = '' } = {}) => {
  const t = escapeAttr(target);
  return `<a href="#${t}" id="${t}-source" class="underline text-[#58B2DC]">${escapeHtml(display)}</a>`;
};

export default internalLink;
