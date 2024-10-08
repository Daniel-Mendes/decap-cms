import withMapControl from './withMapControl.jsx';
import previewComponent from './MapPreview.jsx';
import schema from './schema.js';

const controlComponent = withMapControl();

function Widget(opts = {}) {
  return {
    name: 'map',
    controlComponent,
    previewComponent,
    schema,
    ...opts,
  };
}

export const DecapCmsWidgetMap = { Widget, controlComponent, previewComponent };
export default DecapCmsWidgetMap;
