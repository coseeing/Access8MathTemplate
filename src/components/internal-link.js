import { escapeHtml, escapeAttr } from '@coseeing/see-mark/html';

// Adds the template's blue link color on top of the default internal-link
// markup.
const internalLink = ({ display = '', target = '' } = {}) => {
  const t = escapeAttr(target);
  return `<a href="#${t}" id="${t}-source" class="underline text-[#58B2DC]">${escapeHtml(display)}</a>`;
};

export default internalLink;
