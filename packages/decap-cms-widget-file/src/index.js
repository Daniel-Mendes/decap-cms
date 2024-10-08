import withFileControl from './withFileControl.jsx';
import previewComponent from './FilePreview.jsx';
import schema from './schema';

const controlComponent = withFileControl();

function Widget(opts = {}) {
  return {
    name: 'file',
    controlComponent,
    previewComponent,
    schema,
    ...opts,
  };
}

export const DecapCmsWidgetFile = { Widget, controlComponent, previewComponent, withFileControl };
export default DecapCmsWidgetFile;
