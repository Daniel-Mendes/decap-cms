import controlComponent from './ObjectControl.jsx';
import previewComponent from './ObjectPreview.jsx';
import schema from './schema.js';

function Widget(opts = {}) {
  return {
    name: 'object',
    controlComponent,
    previewComponent,
    schema,
    ...opts,
  };
}

export const DecapCmsWidgetObject = { Widget, controlComponent, previewComponent };
export default DecapCmsWidgetObject;
