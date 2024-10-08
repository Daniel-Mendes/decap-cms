import controlComponent from './ColorControl.jsx';
import previewComponent from './ColorPreview.jsx';

function Widget(opts = {}) {
  return {
    name: 'color',
    controlComponent,
    previewComponent,
    ...opts,
  };
}

export const DecapCmsWidgetColorString = { Widget, controlComponent, previewComponent };
export default DecapCmsWidgetColorString;
