export default defineEventHandler(() => {
  return {
    status: 'ok',
    service: 'proyectomental-v2',
    version: useRuntimeConfig().public.appVersion,
    timestamp: new Date().toISOString(),
  }
})
