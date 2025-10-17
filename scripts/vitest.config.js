import { defineConfig, mergeConfig } from 'vitest/config';
import path from 'node:path';
import react from '@vitejs/plugin-react';

import { getConfig as viteConfig } from './vite.js';

export default mergeConfig(
  viteConfig(),
  defineConfig({
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
      {
        name: 'svg-react-component',
        transform(code, id) {
          if (id.endsWith('.svg')) {
            // Transform SVG files to React components for testing
            return `
              import React from 'react';
              const SvgComponent = (props) => React.createElement('svg', { ...props, 'data-testid': 'mock-svg' });
              export default SvgComponent;
            `;
          }
        },
      },
    ],
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
      transformMode: {
        web: [/\.[jt]sx?$/],
        ssr: [/\.svg$/],
      },
      deps: {
        optimizer: {
          web: {
            include: [
              'vitest-canvas-mock',
              'immutable',
              'lodash',
              'react-immutable-proptypes',
              'common-tags',
              'uuid',
              'redux-mock-store',
              'redux-thunk',
              'react-router-dom',
              'react-router',
              'react',
              'react-dom',
              'history',
              'prop-types',
              '@emotion/react',
              '@emotion/styled',
              '@emotion/css',
              '@dnd-kit/utilities',
              '@dnd-kit/sortable',
              '@dnd-kit/modifiers',
              '@dnd-kit/core',
            ],
          },
        },
        inline: [
          // Force inclusion des packages internes du monorepo
          /^decap-cms-/,
        ],
      },
    },
    esbuild: false, // Utiliser Babel au lieu d'esbuild
    define: {
      'process.env.NODE_ENV': '"test"',
    },
    server: {
      deps: {
        // Inclure tous les packages decap-cms-* dans les dépendances externes
        external: [],
        // Force la transformation des packages internes
        inline: [/^decap-cms-/],
      },
    },
    resolve: {
      alias: {
        // Packages Lib
        'decap-cms-lib-analytics': path.resolve('packages/decap-cms-lib-analytics/src/index.js'),
        'decap-cms-lib-auth': path.resolve('packages/decap-cms-lib-auth/src/index.js'),
        'decap-cms-lib-util': path.resolve('packages/decap-cms-lib-util/src/index.ts'),
        'decap-cms-lib-widgets': path.resolve('packages/decap-cms-lib-widgets/src/index.ts'),

        // UI Packages
        'decap-cms-ui-default': path.resolve('packages/decap-cms-ui-default/src/index.js'),
        'decap-cms-ui-next': path.resolve('packages/decap-cms-ui-next/src/index.js'),

        // Core Packages
        'decap-cms-core': path.resolve('packages/decap-cms-core/src/index.js'),
        'decap-cms-app': path.resolve('packages/decap-cms-app/src/index.js'),
        'decap-cms': path.resolve('packages/decap-cms/src/index.js'),
        'decap-cms-default-exports': path.resolve(
          'packages/decap-cms-default-exports/src/index.js',
        ),

        // Backend Packages
        'decap-cms-backend-aws-cognito-github-proxy': path.resolve(
          'packages/decap-cms-backend-aws-cognito-github-proxy/src/index.js',
        ),
        'decap-cms-backend-azure': path.resolve('packages/decap-cms-backend-azure/src/index.ts'),
        'decap-cms-backend-bitbucket': path.resolve(
          'packages/decap-cms-backend-bitbucket/src/index.ts',
        ),
        'decap-cms-backend-git-gateway': path.resolve(
          'packages/decap-cms-backend-git-gateway/src/index.ts',
        ),
        'decap-cms-backend-gitea': path.resolve('packages/decap-cms-backend-gitea/src/index.ts'),
        'decap-cms-backend-github': path.resolve('packages/decap-cms-backend-github/src/index.ts'),
        'decap-cms-backend-gitlab': path.resolve('packages/decap-cms-backend-gitlab/src/index.ts'),
        'decap-cms-backend-proxy': path.resolve('packages/decap-cms-backend-proxy/src/index.js'),
        'decap-cms-backend-test': path.resolve('packages/decap-cms-backend-test/src/index.js'),

        // Widget Packages
        'decap-cms-widget-boolean': path.resolve('packages/decap-cms-widget-boolean/src/index.js'),
        'decap-cms-widget-code': path.resolve('packages/decap-cms-widget-code/src/index.js'),
        'decap-cms-widget-colorstring': path.resolve(
          'packages/decap-cms-widget-colorstring/src/index.js',
        ),
        'decap-cms-widget-datetime': path.resolve(
          'packages/decap-cms-widget-datetime/src/index.js',
        ),
        'decap-cms-widget-file': path.resolve('packages/decap-cms-widget-file/src/index.js'),
        'decap-cms-widget-image': path.resolve('packages/decap-cms-widget-image/src/index.js'),
        'decap-cms-widget-list': path.resolve('packages/decap-cms-widget-list/src/index.js'),
        'decap-cms-widget-map': path.resolve('packages/decap-cms-widget-map/src/index.js'),
        'decap-cms-widget-markdown': path.resolve(
          'packages/decap-cms-widget-markdown/src/index.js',
        ),
        'decap-cms-widget-number': path.resolve('packages/decap-cms-widget-number/src/index.js'),
        'decap-cms-widget-object': path.resolve('packages/decap-cms-widget-object/src/index.js'),
        'decap-cms-widget-relation': path.resolve(
          'packages/decap-cms-widget-relation/src/index.js',
        ),
        'decap-cms-widget-select': path.resolve('packages/decap-cms-widget-select/src/index.js'),
        'decap-cms-widget-string': path.resolve('packages/decap-cms-widget-string/src/index.js'),
        'decap-cms-widget-text': path.resolve('packages/decap-cms-widget-text/src/index.js'),

        // Analytics Packages
        'decap-cms-analytics-fathom': path.resolve(
          'packages/decap-cms-analytics-fathom/src/index.js',
        ),
        'decap-cms-analytics-plausible': path.resolve(
          'packages/decap-cms-analytics-plausible/src/index.js',
        ),
        'decap-cms-analytics-simple': path.resolve(
          'packages/decap-cms-analytics-simple/src/index.js',
        ),
        'decap-cms-analytics-umami': path.resolve(
          'packages/decap-cms-analytics-umami/src/index.js',
        ),

        // Media Library Packages
        'decap-cms-media-library-cloudinary': path.resolve(
          'packages/decap-cms-media-library-cloudinary/src/index.js',
        ),
        'decap-cms-media-library-uploadcare': path.resolve(
          'packages/decap-cms-media-library-uploadcare/src/index.js',
        ),

        // Other Packages
        'decap-cms-editor-component-image': path.resolve(
          'packages/decap-cms-editor-component-image/src/index.js',
        ),
        'decap-cms-locales': path.resolve('packages/decap-cms-locales/src/index.js'),
        'decap-cms-stock-photos-unsplash': path.resolve(
          'packages/decap-cms-stock-photos-unsplash/src/index.js',
        ),
        'decap-server': path.resolve('packages/decap-server/src/index.js'),

        // Mocks
        '\\.(css|less)$': path.resolve('__mocks__/styleMock.js'),
        '\\.svg$': path.resolve('__mocks__/svgMock.js'),
      },
    },
  }),
);
