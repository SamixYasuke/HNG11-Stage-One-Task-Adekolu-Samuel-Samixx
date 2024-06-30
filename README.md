# Weather Greeting API

This project is an Express.js server that provides weather information and a personalized greeting based on the user's public IP address. The server fetches the user's location using their IP address and then gets the current weather for that location. It is the stage one task given to me from the HNG11 Backend Stack.

## Features

- Fetches the user's public IP address using the `public-ip` library.
- Converts the IP address to location details using the `ipapi.co` API.
- Fetches the weather details for the location using the OpenWeatherMap API.
- Responds with a personalized greeting and weather information.

## Prerequisites

- Node.js
- npm (Node Package Manager)
- Install public-ip (to get ip address)
  
