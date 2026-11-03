export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxt/ui', '@nuxt/content', '@nuxtjs/i18n', '@pinia/nuxt', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  ui: {
    colorMode: false,
    fonts: false,
    prose: false,
    experimental: {
      componentDetection: true,
    },
  },
  content: {
    experimental: {
      sqliteConnector: 'native',
    },
  },
  i18n: {
    defaultLocale: 'es',
    strategy: 'no_prefix',
    locales: [{ code: 'es', name: 'Español', file: 'es.json' }],
    langDir: 'locales',
    detectBrowserLanguage: false,
  },
  runtimeConfig: {
    supabaseServiceRoleKey: '',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    smtpFrom: '',
    backupS3Endpoint: '',
    backupS3Region: '',
    backupS3Bucket: '',
    backupS3AccessKeyId: '',
    backupS3SecretAccessKey: '',
    public: {
      siteUrl: 'http://localhost:3000',
      appVersion: '0.1.0',
      supabaseUrl: '',
      supabaseAnonKey: '',
      accountsEnabled: false,
      glitchtipDsn: '',
      umamiScriptUrl: '',
      umamiWebsiteId: '',
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'ProyectoMental',
      meta: [
        {
          name: 'description',
          content: 'ProyectoMental: una nueva forma de explorar tu Diseño Humano.',
        },
        { name: 'theme-color', content: '#070913' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
  nitro: {
    preset: 'node-server',
  },
  routeRules: {
    '/api/health': {
      headers: {
        'cache-control': 'no-store',
      },
    },
  },
  typescript: {
    strict: true,
  },
  eslint: {
    checker: false,
  },
})
