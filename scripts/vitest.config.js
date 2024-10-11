import { defineConfig, mergeConfig } from 'vitest/config';
import path from 'node:path';

import { getConfig as viteConfig } from './vite.js';

export default mergeConfig(
  viteConfig(),
  defineConfig({
    test: {
      // for vitest-canvas-mock to work
      poolOptions: {
        threads: {
          singleThread: true,
        },
      },
      environment: 'jsdom',
      environmentOptions: {
        jsdom: {
          resources: 'usable',
        },
      },
      globals: true,
      setupFiles: ['scripts/vitest-setup.js'],
      snapshotSerializers: ['scripts/vitest-serializer.ts'],
      deps: {
        optimizer: {
          web: {
            include: ['vitest-canvas-mock'],
          },
        },
      },
    },
    resolve: {
      alias: {
        'decap-cms-lib-auth': 'packages/decap-cms-lib-auth/src/index.js',
        'decap-cms-lib-util': 'packages/decap-cms-lib-util/src/index.ts',
        'decap-cms-lib-widgets': 'packages/decap-cms-lib-widgets/src/index.ts',
        'decap-cms-ui-default': 'packages/decap-cms-ui-default/src/index.js',
        'decap-cms-backend-github': 'packages/decap-cms-backend-github/src/index.ts',
        'decap-cms-widget-object': 'packages/decap-cms-widget-object/src/index.js',
        '\\.(css|less)$': '__mocks__/styleMock.js',
      },
    },
  }),
);
