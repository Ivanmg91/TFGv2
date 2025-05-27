export async function buscarTrailerYouTube(titulo, anio) {
  const query = `${titulo} trailer ${anio || ''}`;
  const url = `https://youtube138.p.rapidapi.com/search/?q=${encodeURIComponent(query)}&hl=es&gl=ES`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '9c65834165msh08c6539059f2807p1f88bejsn3299c205e769', // Sustituye por tu clave de RapidAPI
      'X-RapidAPI-Host': 'youtube138.p.rapidapi.com'
    }
  };

  const response = await fetch(url, options);
  const data = await response.json();

  // Busca el primer video
  const video = data.contents?.find(item => item.type === 'video');
  if (video && video.video && video.video.videoId) {
    return video.video.videoId;
  }
  return null;
}