import controlComponent from './RelationControl.jsx';
import previewComponent from './RelationPreview.jsx';
import schema from './schema.js';

function Widget(opts = {}) {
  return {
    name: 'relation',
    controlComponent,
    previewComponent,
    schema,
    ...opts,
  };
}

export const DecapCmsWidgetRelation = { Widget, controlComponent, previewComponent };
export default DecapCmsWidgetRelation;
