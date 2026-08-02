document.addEventListener('DOMContentLoaded', () => {
  // Enrich minimal database with titles, categories, creators, ratings, description, etc.
  const rawDatabase = window.videoDatabase || [];
  const database = rawDatabase.map((video) => {
    const categories = ['coding', 'coding', 'design', 'space', 'travel', 'design', 'space', 'travel', 'coding', 'design', 'space', 'travel'];
    const category = categories[(video.id - 1) % categories.length] || 'coding';

    const creators = [
      { name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80', verified: true, subs: '1.2M' },
      { name: 'Devon Lane', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80', verified: true, subs: '890K' },
      { name: 'Cody Fisher', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80', verified: false, subs: '320K' },
      { name: 'Jane Cooper', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80', verified: true, subs: '2.1M' },
      { name: 'Albert Flores', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80&q=80', verified: false, subs: '450K' },
      { name: 'Esther Howard', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80&q=80', verified: true, subs: '1.1M' }
    ];
    const creator = creators[(video.id - 1) % creators.length];

    const likes = 90 + (video.id % 11);
    const dates = ["3 days ago", "5 days ago", "1 week ago", "2 weeks ago", "10 days ago", "4 days ago", "1 month ago", "3 weeks ago", "2 days ago", "6 days ago", "1 month ago", "2 months ago"];
    const uploadDate = dates[(video.id - 1) % dates.length];

    return {
      ...video,
      category,
      creator,
      likes,
      uploadDate
    };
  });

  // Formatting View strings
  const formatViewsStr = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return Math.round(num / 1000) + 'K';
    return num.toString();
  };

  // Theme Sync
  const setInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };
  setInitialTheme();

  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // ✅ CHANGE 1: Extract slug from URL Path (/video/slug-name) or query string fallback
  const getSlugFromPath = () => {
  const segments = window.location.pathname
    .split("/")
    .filter(Boolean);

  if (segments[0] === "video" && segments[1]) {
    return decodeURIComponent(segments[1]);
  }

  return null;
};

  let slug = getSlugFromPath();
  let activeVideo = slug ? (window.getVideoBySlug ? window.getVideoBySlug(slug) : null) : null;

  if (!activeVideo) {
    window.location.href = '/index.html';
    return;
  }

  // Populate Elements
  document.title = `${activeVideo.title} - VideoHub`;
  if (document.getElementById('videoDetailTitle')) {
    document.getElementById('videoDetailTitle').textContent = activeVideo.title;
  }
  if (document.getElementById('watchDownloadLink')) {
    document.getElementById('watchDownloadLink').href = activeVideo.videoUrl;
  }

  // ✅ CHANGE 2: Clean URLs for Canonical & OpenGraph tags
  const cleanUrl = `https://teraboxviral.site/video/${slug}/`;
  const fullThumbnail = activeVideo.thumbnail.startsWith('http') 
    ? activeVideo.thumbnail 
    : `https://teraboxviral.site/${activeVideo.thumbnail.replace(/^\//, '')}`;

  if (document.querySelector('meta[name="description"]')) {
    document.querySelector('meta[name="description"]').content = `Watch ${activeVideo.title} on VideoHub. ${formatViewsStr(activeVideo.views)} views.`;
  }
  if (document.querySelector('meta[property="og:title"]')) {
    document.querySelector('meta[property="og:title"]').content = `${activeVideo.title} - VideoHub`;
  }
  if (document.querySelector('meta[property="og:description"]')) {
    document.querySelector('meta[property="og:description"]').content = `Watch ${activeVideo.title} on VideoHub. ${formatViewsStr(activeVideo.views)} views.`;
  }
  if (document.querySelector('meta[property="og:url"]')) {
    document.querySelector('meta[property="og:url"]').content = cleanUrl;
  }
  if (document.querySelector('meta[property="og:image"]')) {
    document.querySelector('meta[property="og:image"]').setAttribute('content', fullThumbnail);
  }
  if (document.querySelector('meta[name="twitter:title"]')) {
    document.querySelector('meta[name="twitter:title"]').content = `${activeVideo.title} - VideoHub`;
  }
  if (document.querySelector('meta[name="twitter:description"]')) {
    document.querySelector('meta[name="twitter:description"]').content = `Watch ${activeVideo.title} on VideoHub.`;
  }
  if (document.querySelector('link[rel="canonical"]')) {
    document.querySelector('link[rel="canonical"]').href = cleanUrl;
  }

  // Inject JSON-LD structured data for video
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": activeVideo.title,
    "description": `${activeVideo.title} - Watch on VideoHub`,
    "thumbnailUrl": fullThumbnail,
    "duration": `PT${activeVideo.duration.replace(':', 'M')}S`,
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "WatchAction",
      "userInteractionCount": activeVideo.views
    }
  });
  document.head.appendChild(ld);

  // Video Player - configure source and poster
  const mainVideoPlayer = document.getElementById('mainVideoPlayer');
  const sampleVideos = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
  ];
  const getSampleVideoUrl = (id) => sampleVideos[(id - 1) % sampleVideos.length];

  if (mainVideoPlayer) {
    mainVideoPlayer.src = getSampleVideoUrl(activeVideo.id);
    mainVideoPlayer.poster = fullThumbnail;
  }

  // Populate Suggestions Sidebar
  const suggestedVideosList = document.getElementById('suggestedVideosList');
  if (suggestedVideosList) {
    suggestedVideosList.innerHTML = '';
    const related = database.filter(v => v.id !== activeVideo.id).slice(0, 10);
    related.forEach(video => {
      const card = document.createElement('article');
      card.className = 'suggested-video-card';
      card.setAttribute('data-id', video.id);
      
      card.innerHTML = `
        <div class="suggested-thumb-wrapper">
          <img src="${video.thumbnail}" class="suggested-thumb" alt="${video.title}" loading="lazy">
          <span class="suggested-duration">${video.duration}</span>
        </div>
        <div class="suggested-body">
          <h4 class="suggested-title">${video.title}</h4>
          <p class="suggested-meta">${formatViewsStr(video.views)} views • ${video.uploadDate}</p>
        </div>
      `;
      
      // ✅ CHANGE 3: Redirect to clean URL path when clicked
      card.addEventListener('click', () => {
        const s = window.getVideoSlug ? window.getVideoSlug(video) : '';
        window.location.href = `/video/${s}/`;
      });
      
      suggestedVideosList.appendChild(card);
    });
  }
});