import controlComponent from './SelectControl.jsx';
import previewComponent from './SelectPreview.jsx';
import schema from './schema.js';

function Widget(opts = {}) {
  return {
    name: 'select',
    controlComponent,
    previewComponent,
    schema,
    ...opts,
  };
}

export const DecapCmsWidgetSelect = { Widget, controlComponent, previewComponent };
export default DecapCmsWidgetSelect;
