export async function buscarTrailerYouTube(titulo, anio) {
  const query = `${titulo} trailer ${anio || ''}`;
  const url = `https://youtube138.p.rapidapi.com/search/?q=${encodeURIComponent(query)}&hl=es&gl=ES`;

  // options
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '4654dd0d3cmsh03796de88e5c5d2p1a75c0jsnee7caa5b9852',
      'X-RapidAPI-Host': 'youtube138.p.rapidapi.com'
    }
  };

  const response = await fetch(url, options);
  const data = await response.json();

  // search first video
  const video = data.contents?.find(item => item.type === 'video');
  if (video && video.video && video.video.videoId) {
    return video.video.videoId;
  }
  return null;
}