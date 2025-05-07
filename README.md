# TFGv2
Trabajo fin de grado 2DAM

## GUIDE TO INSTALL USING DOCKER

### Enter to the project path using the next command
- cd streaming-calculator/

### Use this comands to install the docker container
- docker compose build
- docker compose up

### Enter to the terminal url
http://localhost:3000

## Pendiente
- Hacer algo intuitivo para cuando quieres ver peliculas sin filtrarlas por genero...
- Si pones muchos filtros es obvio q no va a existir esa pelicula. hacer q no se quede en cargando películas y muestre un aviso de q no hay resultados. MEDIO RESUELTO = en el fetch inicial sale no se encontraron peliculas
- Introducir google analytics
- Hacer q los botones de avanzar y retroceder pagina no hagan  nada hasta q no carguen las peliculas para evitar bugs.
- Hacer q no siempre salgan las mismas peliculas en la primera vista de peliculas, mediante algun criterio (populares, más vistas, con mejor puntuación...)
- Añadir para buscar pelicula por nombre si coincide lo q escrito con el nombre de alguna pelicula, incluyendo si no es el nombre completo y exacto
- Editar la vista movil (IMPORTANTE)
- Intentar login
- Intentar base de datos (para añadir peliculas favoritas, por ejemplo)
- Al seleccionar generos y pasar de pagina dejan de estar aplicados los generos
- Igual las primeras peliculas q se muestran no deberian ser top shows sino peliculas random q siempre van a ser diferentes y q se puedan paginar.
- Habra q poner el boton de aplicar fuera del dropdown para q no solo aplique los generos sino tambien todos los demas filtros q faltan por introducir.
- Q vaya hasta arriba de la pagina al pasar de pagina