import controlComponent from './TextControl.jsx';
import previewComponent from './TextPreview.jsx';

function Widget(opts = {}) {
  return {
    name: 'text',
    controlComponent,
    previewComponent,
    ...opts,
  };
}

export const DecapCmsWidgetText = { Widget, controlComponent, previewComponent };
export default DecapCmsWidgetText;
