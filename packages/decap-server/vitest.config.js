import { defineConfig, mergeConfig } from 'vitest/config';

import { getConfig as viteConfig } from './vite.config.js';

export default mergeConfig(
  viteConfig(),
  defineConfig({
    test: {
      environment: 'node',
      globals: true,
    },
    resolve: {
      alias: {
        'decap-cms-lib-util': 'packages/decap-cms-lib-util/src/index.ts',
      },
    },
  }),
);
