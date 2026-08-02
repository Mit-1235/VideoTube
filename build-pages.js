const fs = require("fs");
const path = require("path");

// Helper function to create clean slugs
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

try {
  console.log("🚀 Starting static page build process...");

  // Read template
  const templatePath = path.join(__dirname, "templates", "video.html");

  if (!fs.existsSync(templatePath)) {
    throw new Error("templates/video.html not found.");
  }

  const htmlTemplate = fs.readFileSync(templatePath, "utf8");

  // Read videos.js
  const videosJsPath = path.join(__dirname, "videos.js");

  if (!fs.existsSync(videosJsPath)) {
    throw new Error("videos.js not found.");
  }

  const videosJsContent = fs.readFileSync(videosJsPath, "utf8");

  const window = {};
  const runScript = new Function("window", videosJsContent);
  runScript(window);

  const videos = window.videoDatabase || [];

  console.log(`📦 Found ${videos.length} videos.`);

  videos.forEach((video) => {
    const slug = slugify(video.title);

    const videoDir = path.join(__dirname, "video", slug);

    fs.mkdirSync(videoDir, { recursive: true });

    let pageContent = htmlTemplate;

    const pageUrl = `https://teraboxviral.site/video/${slug}/`;

    const imageUrl = video.thumbnail.startsWith("http")
      ? video.thumbnail
      : `https://teraboxviral.site${video.thumbnail}`;

    const description = `Watch ${video.title} online in HD on VideoHub. Browse similar trending videos.`;

    const jsonLd = JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: video.title,
        description: description,
        thumbnailUrl: imageUrl,
        contentUrl: video.videoUrl,
        url: pageUrl,
        duration: `PT${video.duration.replace(":", "M")}S`,
        interactionStatistic: {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/WatchAction",
          userInteractionCount: video.views,
        },
      },
      null,
      2
    );

    const replacements = {
      "{{TITLE}}": video.title,
      "{{DESCRIPTION}}": description,
      "{{URL}}": pageUrl,
      "{{IMAGE}}": imageUrl,
      "{{JSONLD}}": jsonLd,
    };

    for (const [placeholder, value] of Object.entries(replacements)) {
      pageContent = pageContent.replaceAll(placeholder, value);
    }

    const indexPath = path.join(videoDir, "index.html");

    fs.writeFileSync(indexPath, pageContent, "utf8");

    console.log(`✅ Generated /video/${slug}/index.html`);
  });

  console.log("\n🎉 Build completed successfully.");

} catch (err) {
  console.error("\n❌ Build failed:");
  console.error(err);
  process.exit(1);
}