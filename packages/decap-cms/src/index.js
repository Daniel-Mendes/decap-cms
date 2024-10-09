import createReactClass from 'create-react-class';
import React from 'react';
import { DecapCmsApp as CMS } from 'decap-cms-app';
import './extensions';

/**
 * Load Decap CMS automatically if `window.CMS_MANUAL_INIT` is set.
 */
if (globalThis.CMS_MANUAL_INIT) {
  console.log('`window.CMS_MANUAL_INIT` flag set, skipping automatic initialization.');
} else {
  CMS.init();
}

/**
 * Add extension hooks to global scope.
 */
if (typeof globalThis !== 'undefined') {
  globalThis.CMS = CMS;
  globalThis.initCMS = CMS.init;
  globalThis.createClass = globalThis.createClass || createReactClass;
  globalThis.h = globalThis.h || React.createElement;
  /**
   * Log the version number.
   */
  if (typeof DECAP_CMS_VERSION === 'string') {
    console.log(`decap-cms ${DECAP_CMS_VERSION}`);
  }
}

export const DecapCms = {
  ...CMS,
};


export {DecapCmsApp as default} from 'decap-cms-app';