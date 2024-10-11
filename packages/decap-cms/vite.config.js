import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { toGlobalName } from '../../scripts/externals';
import { version as coreVersion } from '../decap-cms-core/package.json';
import { version as appVersion } from '../decap-cms-app/package.json';
import pkg from './package.json';

export default defineConfig({
  root: '../../dev-test',
  publicDir: '../../dev-test',

  build: {
    lib: {
      entry: `${process.cwd()}/src/index.js`,
      name: toGlobalName(pkg.name),
      fileName: () => `${pkg.name}.js`,
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        exports: 'named',
      },
    },
    outDir: `${process.cwd()}/dist`,
    emptyOutDir: true,
  },

  server: {
    open: true,
    fs: {
      strict: false,
      allow: ['..'],
    },
    hmr: {
      overlay: false,
    },
  },

  resolve: {
    alias: {
      'decap-cms': `${process.cwd()}/src/index.js`,
    },
  },

  optimizeDeps: {
    include: ['codemirror', 'ol'],
  },

  plugins: [
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
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        compact: false,
        // presets: [
        //   [
        //     '@babel/preset-react',
        //     {
        //       runtime: 'automatic',
        //       importSource: '@emotion/react',
        //     },
        //   ],
        // ],
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],

  define: {
    DECAP_CMS_VERSION: JSON.stringify(pkg.version),
    DECAP_CMS_APP_VERSION: JSON.stringify(appVersion),
    DECAP_CMS_CORE_VERSION: JSON.stringify(coreVersion),
  },
});
