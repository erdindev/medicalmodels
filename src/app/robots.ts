import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/', '/dashboard/', '/saved/', '/comparisons/', '/settings/'],
      },
    ],
    sitemap: 'https://medicalmodels.co/sitemap.xml',
  }
}
