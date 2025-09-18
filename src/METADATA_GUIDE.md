# Dynamic Metadata System - Implementation Guide

## Overview
This system provides comprehensive, dynamic metadata management for all pages in your Chameleon application, ensuring proper SEO optimization and social media sharing.

## Files Created/Modified

### Core Files
- `lib/metadata.ts` - Main metadata configuration and generation functions
- `lib/dynamic-metadata.ts` - Client-side dynamic metadata hook for React components
- `app/layout.tsx` - Updated with site-wide metadata

### Page Updates
- `app/about/page.tsx` - Added static metadata
- `app/auth/layout.tsx` - Added auth-specific metadata
- `app/privacy/page.tsx` - Added dynamic metadata
- `app/terms/page.tsx` - Added dynamic metadata
- `app/drive/[driveId]/page.tsx` - Added dynamic metadata based on drive name
- `app/drive/[driveId]/[...folderPath]/page.tsx` - Added dynamic metadata based on folder name

## Usage Examples

### For Static Pages (Server Components)
```typescript
import { generateMetadata, pageMetadata } from "@/lib/metadata"

export const metadata = generateMetadata({
  ...pageMetadata.about,
  path: "/about"
})

export default function AboutPage() {
  // Your component code
}
```

### For Dynamic Client Components
```typescript
import { useDynamicMetadata, dynamicPageMetadata } from '@/lib/dynamic-metadata'

export default function MyPage() {
  // Dynamic metadata based on data
  useDynamicMetadata(dynamicPageMetadata.driveRoot(driveName))
  
  // Or custom metadata
  useDynamicMetadata({
    title: "Custom Page Title",
    description: "Custom description",
    keywords: ["custom", "keywords"],
    path: "/custom-path"
  })
}
```

## Features Included

### SEO Optimization
- ✅ Dynamic page titles
- ✅ Meta descriptions
- ✅ Keywords optimization
- ✅ Canonical URLs
- ✅ Robots.txt directives
- ✅ Structured data support

### Social Media Integration
- ✅ Open Graph tags (Facebook, LinkedIn)
- ✅ Twitter Card support
- ✅ Social media images
- ✅ Rich previews

### Technical SEO
- ✅ Site-wide icon configuration
- ✅ Apple touch icons
- ✅ Favicon support
- ✅ Mobile optimization
- ✅ Search engine verification codes

## Predefined Page Types

### Available in `pageMetadata`
- `home` - Homepage metadata
- `drive` - Drive/file management pages
- `auth` - Authentication pages
- `dashboard` - User dashboard
- `profile` - User profile
- `quiz` - Quiz/assessment pages
- `courses` - Course listing
- `specialization` - Specialization pages
- `about` - About page
- `privacy` - Privacy policy (noIndex: true)
- `terms` - Terms of service (noIndex: true)

### Dynamic Generators in `dynamicPageMetadata`
- `driveRoot(driveName)` - For drive root pages
- `driveFolder(folderName, driveName)` - For folder pages
- `quiz(department)` - For department-specific quizzes
- `specialization(department)` - For department specializations
- `youtube(playlistTitle)` - For YouTube playlists
- `dashboard(userName)` - For user dashboards

## Configuration

### Site Configuration (`lib/metadata.ts`)
Update the `siteConfig` object with your site details:
```typescript
export const siteConfig = {
  name: "Your Site Name",
  title: "Your Site Title",
  description: "Your site description",
  url: "https://yourdomain.com",
  ogImage: "/images/your-og-image.jpg",
  icon: "/images/your-icon.png",
  // ... other settings
}
```

### Adding New Page Types
1. Add to `pageMetadata` in `lib/metadata.ts` for static pages
2. Add to `dynamicPageMetadata` in `lib/dynamic-metadata.ts` for dynamic pages

## Best Practices

### Title Optimization
- Keep titles under 60 characters
- Include relevant keywords
- Use consistent branding format: "Page Title | Site Name"

### Description Optimization
- Keep descriptions 150-160 characters
- Include primary keywords naturally
- Make them compelling for click-through

### Keywords
- Use 5-10 relevant keywords per page
- Include long-tail keywords
- Avoid keyword stuffing

## Monitoring and Analytics

### Search Console Integration
Add your verification codes in `lib/metadata.ts`:
```typescript
verification: {
  google: "your-google-verification-code",
  yandex: "your-yandex-verification-code",
  yahoo: "your-yahoo-verification-code",
}
```

### Analytics Tracking
The metadata system supports:
- Google Analytics
- Google Search Console
- Social media analytics
- Rich snippet monitoring

## Future Enhancements

### Planned Features
- [ ] JSON-LD structured data
- [ ] Breadcrumb schema
- [ ] Article schema for blog posts
- [ ] Course schema for educational content
- [ ] Multi-language support
- [ ] A/B testing for titles/descriptions

### Customization Options
- Page-specific Open Graph images
- Dynamic keyword generation based on content
- Automatic meta description generation
- Schema.org markup integration

## Testing Your Implementation

### Tools to Use
1. **Google Search Console** - Monitor search performance
2. **Facebook Sharing Debugger** - Test Open Graph tags
3. **Twitter Card Validator** - Test Twitter cards
4. **LinkedIn Post Inspector** - Test LinkedIn sharing
5. **Schema.org Validator** - Test structured data

### Manual Testing
1. View page source to verify meta tags
2. Test social media sharing
3. Check mobile responsiveness
4. Validate HTML markup
5. Test canonical URLs

## Troubleshooting

### Common Issues
- **Meta tags not updating**: Clear browser cache and check client-side hydration
- **Social media not showing images**: Verify image paths and sizes
- **Duplicate meta tags**: Ensure only one metadata source per page
- **Missing canonical URLs**: Check path configuration in metadata calls

### Debug Mode
Enable console logging in development by adding to `lib/dynamic-metadata.ts`:
```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('Updating metadata:', { title, description, keywords, path })
}
```