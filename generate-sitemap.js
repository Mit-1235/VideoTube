const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://teraboxviral.site';

// Import videos.js context
const videosJsPath = path.join(__dirname, 'videos.js');
const videosJsContent = fs.readFileSync(videosJsPath, 'utf8');

const window = {};
const runScript = new Function('window', videosJsContent);
runScript(window);

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const videos = window.videoDatabase || [];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// 1. Static Pages
xml += `  <url>\n    <loc>${DOMAIN}/</loc>\n    <priority>1.0</priority>\n  </url>\n`;
xml += `  <url>\n    <loc>${DOMAIN}/contact.html</loc>\n    <priority>0.5</priority>\n  </url>\n`;

// 2. Dynamic Video Pages
videos.forEach(video => {
  const slug = slugify(video.title);
  xml += `  <url>\n`;
  xml += `    <loc>${DOMAIN}/video/${slug}</loc>\n`;
  xml += `    <priority>0.8</priority>\n`;
  xml += `  </url>\n`;
});

xml += `</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), xml, 'utf8');
console.log('sitemap.xml updated with clean URLs!');