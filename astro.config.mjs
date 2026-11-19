import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://ricardoguque.github.io',
  base: '/history',
  output: 'static',
  integrations: [react()],
});
