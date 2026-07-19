export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  if (url.pathname.startsWith('/video/') || url.pathname === '/video') {
    url.pathname = '/video.html';
    return env.ASSETS.fetch(new Request(url));
  }

  return next();
}
