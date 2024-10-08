import controlComponent from './CodeControl.jsx';
import previewComponent from './CodePreview.jsx';
import schema from './schema.js';

function Widget(opts = {}) {
  return {
    name: 'code',
    controlComponent,
    previewComponent,
    schema,
    allowMapValue: true,
    codeMirrorConfig: {},
    ...opts,
  };
}

export const DecapCmsWidgetCode = { Widget, controlComponent, previewComponent };
export default DecapCmsWidgetCode;
