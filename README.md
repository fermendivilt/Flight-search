# Flight-search
Flight search app that consumes Amadeus API

# How to Run
## Requirements
1. AmadeusAPI account: personal testing api key and secret. [Here is the page!](https://developers.amadeus.com/)
2. Java 22
3. NPM
4. Docker desktop (or your preferred way to run containers, but in this case I have it)
5. A way to bypass your company's VPN (useful when testing locally with Docker)

## Steps
1. Pull this repository
2. Create a .env file at root, and add (without quotes or dash):
- "API_KEY="yourApiKey
- "API_SECRET="yourApiSecret
3. From the /front/front folder run:
- npm i
- note: you can run "npm run build" if you want the production build, but the dockerfile already tells the container to do it
4. Now, from the /back/FlightSearch run:
- gradle build (this is also necessary for new changes to apply)
5. You are ready to go! Run "docker-compose up -d --build" and, after some time, you will be able to access the app from the front-end (back has cors :c) at localhost:3000