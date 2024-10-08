import controlComponent from './DateTimeControl.jsx';
import previewComponent from './DateTimePreview.jsx';
import schema from './schema.js';

function Widget(opts = {}) {
  return {
    name: 'datetime',
    controlComponent,
    previewComponent,
    schema,
    ...opts,
  };
}

export const DecapCmsWidgetDatetime = { Widget, controlComponent, previewComponent };
export default DecapCmsWidgetDatetime;
