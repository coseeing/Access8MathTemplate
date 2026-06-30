import { escapeHtml, escapeAttr } from '@coseeing/see-mark/html';

const internalLink = ({ display = '', target = '' } = {}) => {
  const t = escapeAttr(target);
  return `<a href="#${t}" id="${t}-source" class="underline text-[#58B2DC]">${escapeHtml(display)}</a>`;
};

export default internalLink;
