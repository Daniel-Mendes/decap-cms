import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { toGlobalName, externals, globals } from './externals.js';
import { version as coreVersion } from '../packages/decap-cms-core/package.json';
import { version as appVersion } from '../packages/decap-cms-app/package.json';

// Import package.json using dynamic import
async function getPackageJson() {
  // Use a valid file URL for package.json
  const pkgPath = pathToFileURL(path.resolve(process.cwd(), 'package.json')).href;

  // Dynamically import package.json using the file URL
  const pkg = await import(pkgPath, { with: { type: 'json' } }); // Use dynamic import

  return pkg.default;
}

export async function getConfig() {
  const pkg = await getPackageJson();

  return defineConfig({
    build: {
      lib: {
        entry: './src',
        name: toGlobalName(pkg.name),
      },

      rollupOptions: {
        external: externals,
        output: {
          exports: 'named',
          globals: globals,
        },
      },
    },

    optimizeDeps: {
      include: ['codemirror', 'ol'],
    },

    plugins: [
      nodePolyfills({
        include: ['stream', 'buffer', 'path'],
        globals: {
          Buffer: true,
        },
      }),
      svgr({
        include: '**/*.svg',
      }),
      react({
        jsxImportSource: '@emotion/react',
        plugins: [['@swc/plugin-emotion', {}]],
      }),
    ],

    define: {
      DECAP_CMS_APP_VERSION: JSON.stringify(appVersion),
      DECAP_CMS_CORE_VERSION: JSON.stringify(coreVersion),
    },
  });
}
