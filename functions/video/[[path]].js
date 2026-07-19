export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const videoUrl = new URL('/video.html', url);
  return fetch(videoUrl.toString());
}
