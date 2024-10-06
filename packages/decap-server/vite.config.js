import { defineConfig } from 'vite';
import nodeExternals from 'rollup-plugin-node-externals';

const allowlist = [/^decap-cms-lib-util/];

export default defineConfig({
  build: {
    rollupOptions: {
      input: ['src/index.ts', 'src/middlewares.ts'],

      output: {
        format: 'es',
        entryFileNames: '[name].js',
      },
    },
    sourcemap: true,
  },

  plugins: [nodeExternals({ include: allowlist })],
});
