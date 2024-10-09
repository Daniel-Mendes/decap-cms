import getActiveLink from '../selectors/getActiveLink';
import unwrapLink from '../transforms/unwrapLink';
import wrapLink from '../transforms/wrapLink';

function toggleLink(editor, promptText) {
  const activeLink = getActiveLink(editor);
  const activeUrl = activeLink ? activeLink[0]?.data?.url : '';
  const url = globalThis.prompt(promptText, activeUrl);
  if (url == undefined) return;
  if (url === '') {
    unwrapLink(editor);
    return;
  }
  wrapLink(editor, url);
}

export default toggleLink;
