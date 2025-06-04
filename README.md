# TFGv2
Trabajo fin de grado 2DAM

## GUIDE TO INSTALL USING DOCKER

### Enter to the project path using the next command
- cd streaming-calculator/

### Use this comands to install the docker container
- docker compose build

- rm -rf node_modules package-lock.json
- npm install

- docker compose up

### Enter to the terminal url
http://localhost:3000

## INFO
The web app is being hosted with netlify. This is a free hosting service. For update it only need do a git commit.
Has integrated google analytics and google adsense.
It use a 2 differents api from rapidapi.com: streaming availability and youtube api. This apis use a basic plan, sometimes is necessary use other count to use. Streaming availability 1000 api calls. Youtube 100 api calls.

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
- Al abrir el desplegable con la info de la pelicula un boton de ver ahora q t lleve a los enlaces de suscripcion o metodos de pago de las plataformas donde se puede ver
- Algunos valores cambian entre peliculas y series como releaseyear y firstairyear, entonces por eso en las series hay informacion q no se muestra.
- Firebase authentication
- Base de datos + apartado de favoritos de alguna manera con la base de datso
- Hacer q al volver para atras (flecha arriba izquierda) no vuelva a buscar y mantenga las peliculas q estaban






Usar Capacitor o Cordova
Ventaja: Puedes empaquetar tu app web (tal cual la tienes) como una app Android (WebView). Solo necesitas compilar tu proyecto (npm run build) y luego integrarlo con Capacitor o Cordova.
Desventaja: La app será una webview, no una app nativa real, pero para muchas apps es suficiente.
Pasos básicos con Capacitor:
Instala Capacitor:
Compila tu app React:
Añade la plataforma Android:
Copia los archivos de build:
Abre el proyecto en Android Studio:

acortador de anuncios: https://shrinkme.io/member/dashboard
google analytics: https://analytics.google.com/analytics/web/?hl=es#/p488460761/reports/intelligenthome?params=_u..nav%3Dmaui&collectionId=business-objectives
firebase: https://console.firebase.google.com/project/tfgv2-c4f8a/overview?hl=es-419
aiven: https://console.aiven.io/account/a53a3f24dafd/project/tfgv2/services/mysql-2dd7e983/overview

NECESARIO INICIAR RENDER PARA Q EL TEMA DE USUARIOS FUNCIONE SIEMPRE