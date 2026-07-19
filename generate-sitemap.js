const fs = require('fs');
const path = require('path');

// Read videos.js and extract video data
const videosPath = path.join(__dirname, 'videos.js');
const c = fs.readFileSync(videosPath, 'utf8');

// Match all video objects with id, thumbnail, title
const re = /{\s*id:\s*(\d+),\s*thumbnail:\s*"([^"]+)",\s*title:\s*"([^"]+)"/g;
let m;
const videos = [];
while ((m = re.exec(c)) !== null) {
  videos.push({
    id: parseInt(m[1]),
    thumbnail: m[2],
    title: m[3]
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const domain = 'https://teraboxviral.site';
const today = new Date().toISOString().split('T')[0];

// --- Generate sitemap.xml ---
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
xml += '  <url>\n';
xml += `    <loc>${domain}/index.html</loc>\n`;
xml += '    <changefreq>daily</changefreq>\n';
xml += '    <priority>1.0</priority>\n';
xml += '  </url>\n';

  videos.sort((a, b) => a.id - b.id).forEach(v => {
  const s = slugify(v.title);
  xml += '  <url>\n';
  xml += `    <loc>${domain}/video/${s}</loc>\n`;
  xml += '    <changefreq>daily</changefreq>\n';
  xml += '    <priority>0.8</priority>\n';
  xml += '  </url>\n';
});

xml += '</urlset>\n';
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), xml);
console.log(`✓ sitemap.xml — ${videos.length} video URLs`);

// --- Generate robots.txt ---
const robots = `User-agent: *
Allow: /

Sitemap: ${domain}/sitemap.xml
`;
fs.writeFileSync(path.join(__dirname, 'robots.txt'), robots);
console.log('✓ robots.txt');

console.log(`\nDone! ${videos.length + 1} total URLs generated.`);
