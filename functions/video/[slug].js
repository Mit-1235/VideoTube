export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  url.pathname = '/video.html';
  const resp = await env.ASSETS.fetch(new Request(url));
  return new Response(resp.body, resp);
}
