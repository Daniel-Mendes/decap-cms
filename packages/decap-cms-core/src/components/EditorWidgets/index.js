import { registerWidget } from '../../lib/registry';
import UnknownControl from './Unknown/UnknownControl.jsx';
import UnknownPreview from './Unknown/UnknownPreview.jsx';

registerWidget('unknown', UnknownControl, UnknownPreview);
