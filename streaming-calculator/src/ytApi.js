export async function buscarTrailerYouTube(titulo, anio) {
  const query = `${titulo} trailer ${anio || ''}`;
  const url = `https://youtube138.p.rapidapi.com/search/?q=${encodeURIComponent(query)}&hl=es&gl=ES`;

  // options
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'd8be2f7af3msh26d4d5aeb0d4312p179a91jsnc81efc53db51',
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