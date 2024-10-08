import controlComponent from './StringControl.jsx';
import previewComponent from './StringPreview.jsx';

function Widget(opts = {}) {
  return {
    name: 'string',
    controlComponent,
    previewComponent,
    ...opts,
  };
}

export const DecapCmsWidgetString = { Widget, controlComponent, previewComponent };
export default DecapCmsWidgetString;
