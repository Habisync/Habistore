import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    hydrogen({
      shopifyConfig: './shopify.config.js',
    }),
    remix(),
    tsconfigPaths(),
  ],
});
