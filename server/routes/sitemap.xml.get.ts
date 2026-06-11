import { categories } from '../../app/utils/categories'

const BASE_URL = 'https://randomting.app'

const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/tools', changefreq: 'weekly', priority: 0.9 },
  { path: '/multiplayer', changefreq: 'weekly', priority: 0.8 },
  { path: '/multiplayer/create', changefreq: 'monthly', priority: 0.6 },
  { path: '/auth/login', changefreq: 'monthly', priority: 0.3 },
  { path: '/auth/register', changefreq: 'monthly', priority: 0.3 },
  { path: '/offline', changefreq: 'monthly', priority: 0.1 },
]

export default defineEventHandler(async (event) => {
  const toolRoutes = categories.flatMap(cat =>
    cat.tools.map(tool => ({
      path: `/tools/${tool.slug}`,
      changefreq: 'weekly',
      priority: 0.7,
    }))
  )

  const allRoutes = [...staticRoutes, ...toolRoutes]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(r => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml')
  return xml
})
