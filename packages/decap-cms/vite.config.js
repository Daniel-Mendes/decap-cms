import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  root: '../../dev-test',
  publicDir: '../../dev-test',

  build: {
    outDir: '../../dist',

    rollupOptions: {
      input: './src/index.js',

      output: [
        {
          format: 'iife',
          entryFileNames: 'decap-cms.js',
          name: 'DecapCMS',
          exports: 'named',
        },
        {
          format: 'esm',
          entryFileNames: 'decap-cms.mjs',
          exports: 'named',
        },
      ],
    },
  },

  server: {
    open: true,

    fs: {
      strict: false,
    },
    // warmup: {
    //   clientFiles: ['src/**/*.js'],
    // },
    // hmr: {
    //   overlay: false,
    // },
  },

  plugins: [react()],
});
