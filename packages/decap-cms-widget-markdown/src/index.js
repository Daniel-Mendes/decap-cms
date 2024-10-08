import controlComponent from './MarkdownControl';
import previewComponent from './MarkdownPreview.jsx';
import schema from './schema.js';

function Widget(opts = {}) {
  return {
    name: 'markdown',
    controlComponent,
    previewComponent,
    schema,
    ...opts,
  };
}

export const DecapCmsWidgetMarkdown = { Widget, controlComponent, previewComponent };
export default DecapCmsWidgetMarkdown;
