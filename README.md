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