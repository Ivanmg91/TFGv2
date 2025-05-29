// Busca la imagen principal de un actor en Wikipedia
export async function obtenerImagenActorWikipedia(nombreActor) {
  const url = `https://es.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(nombreActor)}&prop=pageimages&format=json&pithumbsize=200&origin=*`;
  const res = await fetch(url);
  const data = await res.json();
  const pages = data.query.pages;
  const page = Object.values(pages)[0];
  return page?.thumbnail?.source || null;
}

// Ejemplo de uso:
obtenerImagenActorWikipedia("Penélope Cruz").then(url => {
  console.log("Imagen:", url);
});