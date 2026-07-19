export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;

      if (path.startsWith('/video/') || path === '/video') {
        url.pathname = '/video.html';
        return await env.ASSETS.fetch(new Request(url));
      }

      return await env.ASSETS.fetch(request);
    } catch (err) {
      return new Response(`Error: ${err.message}`, { status: 500 });
    }
  }
};
