import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.christinecal.com',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'pl'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
