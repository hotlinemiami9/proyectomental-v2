export const SITE_NAME = 'ProyectoMental'

export function formatPageTitle(pageTitle?: string) {
  return pageTitle ? `${pageTitle} · ${SITE_NAME}` : SITE_NAME
}
