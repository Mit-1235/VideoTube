# VideoHub

## Important Commands

### Generate Sitemap & Robots.txt

After adding, removing, or renaming videos in `videos.js`, regenerate the sitemap:

```
node generate-sitemap.js
```

This updates both `sitemap.xml` and `robots.txt` automatically.

### Submit to Search Engines

1. **Google Search Console**: https://search.google.com/search-console → Add property → Sitemaps → `sitemap.xml`
2. **Bing Webmaster Tools**: https://www.bing.com/webmasters → Add site → Sitemaps → `sitemap.xml`

## Project Structure

```
├── index.html          Homepage with video grid
├── video.html          Video player page (per video)
├── contact.html        Contact / video removal page
├── script.js           Homepage logic (cards, search, pagination)
├── watch.js            Video page logic (player, suggestions)
├── videos.js           Video database
├── style.css           All styles
├── images/             Video thumbnails
├── sitemap.xml         Auto-generated (run generate-sitemap.js)
├── robots.txt          Auto-generated (run generate-sitemap.js)
└── generate-sitemap.js Sitemap generator script
```

## SEO Notes

- Video cards use `<a>` tags with `href` — Googlebot can crawl them
- Each video page has dynamic OG tags + JSON-LD structured data
- Sitemap covers all 99+ video pages
