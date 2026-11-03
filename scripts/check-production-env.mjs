const required = [
  'NUXT_PUBLIC_SITE_URL',
  'NUXT_PUBLIC_SUPABASE_URL',
  'NUXT_PUBLIC_SUPABASE_ANON_KEY',
  'NUXT_SUPABASE_SERVICE_ROLE_KEY',
  'NUXT_SMTP_HOST',
  'NUXT_SMTP_USER',
  'NUXT_SMTP_PASSWORD',
  'NUXT_SMTP_FROM',
  'NUXT_PUBLIC_GLITCHTIP_DSN',
  'NUXT_PUBLIC_UMAMI_SCRIPT_URL',
  'NUXT_PUBLIC_UMAMI_WEBSITE_ID',
  'NUXT_BACKUP_S3_ENDPOINT',
  'NUXT_BACKUP_S3_BUCKET',
  'NUXT_BACKUP_S3_ACCESS_KEY_ID',
  'NUXT_BACKUP_S3_SECRET_ACCESS_KEY',
]

const missing = required.filter((name) => !process.env[name]?.trim())

if (missing.length > 0) {
  console.error(`Missing production environment variables: ${missing.join(', ')}`)
  process.exit(1)
}

console.log('Production environment variables are present.')
