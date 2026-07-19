export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Rewrite /video/* to /video.html
    if (path.startsWith('/video/')) {
      return env.ASSETS.fetch(new Request(new URL('/video.html', request.url), request));
    }

    // Serve static assets normally
    return env.ASSETS.fetch(request);
  }
};
