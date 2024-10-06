import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

import { toGlobalName } from './externals.js';
import { version as coreVersion } from '../packages/decap-cms-core/package.json';
import { version as appVersion } from '../packages/decap-cms-app/package.json';

// Import package.json using dynamic import
async function getPackageJson() {
  // Use a valid file URL for package.json
  const pkgPath = pathToFileURL(resolve(process.cwd(), 'package.json')).href;

  // Dynamically import package.json using the file URL
  const pkg = await import(pkgPath, { with: { type: 'json' } }); // Use dynamic import

  return pkg.default;
}

export async function getConfig() {
  const pkg = await getPackageJson();

  return defineConfig({
    plugins: [
      {
        name: 'treat-js-files-as-jsx',
        async transform(code, id) {
          if (!id.match(/src\/.*\.js$/)) return null;

          // Use the exposed transform from vite, instead of directly
          // transforming with esbuild
          return transformWithEsbuild(code, id, {
            loader: 'jsx',
            jsx: 'automatic',
          });
        },
      },
      {
        name: 'print-server-url',
        apply: 'serve',
        configureServer(server) {
          server.httpServer.on('listening', () => {
            const { logger } = server.config;
            const { port } = server.config.server;
            logger.info(`Decap CMS is now running at http://localhost:${port}`);
          });
        },
      },
      react(),
    ],

    resolve: {
      alias: {
        path: 'path-browserify',
        stream: 'stream-browserify',
        buffer: 'buffer',
      },
    },

    build: {
      rollupOptions: {
        input: './src',

        output: [
          {
            format: 'iife',
            entryFileNames: `${pkg.name}.js`,
            name: toGlobalName(pkg.name),
            exports: 'named',
          },
          {
            format: 'es',
            entryFileNames: `${pkg.name}.mjs`,
            exports: 'named',
          },
        ],
        // Keep exports in the ES module
        preserveEntrySignatures: 'strict',
      },
    },

    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },

    define: {
      DECAP_CMS_APP_VERSION: JSON.stringify(appVersion),
      DECAP_CMS_CORE_VERSION: JSON.stringify(coreVersion),
    },
  });
}
