import { DecapCmsCore as CMS } from 'decap-cms-core';
import './extensions.js';

// Log version
if (typeof globalThis !== 'undefined' && typeof DECAP_CMS_APP_VERSION === 'string') {
    console.log(`decap-cms-app ${DECAP_CMS_APP_VERSION}`);
  }

export const DecapCmsApp = {
  ...CMS,
};


export {DecapCmsCore as default} from 'decap-cms-core';