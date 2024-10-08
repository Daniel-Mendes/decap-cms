import bootstrap from './bootstrap.jsx';
import Registry from './lib/registry';

export const DecapCmsCore = {
  ...Registry,
  init: bootstrap,
};
export default DecapCmsCore;
