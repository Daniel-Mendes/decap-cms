import controlComponent from './CodeField';
import previewComponent from './CodePreview';
import schema from './schema';

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

export { controlComponent, previewComponent };
export { default as CodeField } from './CodeField';
export { default as CodePreview } from './CodePreview';

export const DecapCmsWidgetCode = { Widget, controlComponent, previewComponent };
export default DecapCmsWidgetCode;
