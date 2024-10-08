import controlComponent from './NumberControl.jsx';
import previewComponent from './NumberPreview.jsx';
import schema from './schema.js';

function Widget(opts = {}) {
  return {
    name: 'number',
    controlComponent,
    previewComponent,
    schema,
    ...opts,
  };
}

export const DecapCmsWidgetNumber = { Widget, controlComponent, previewComponent };
export default DecapCmsWidgetNumber;
