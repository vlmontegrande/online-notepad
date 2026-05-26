# Online Notepad

A small web app I built so i can keep notes between different devices. The notes are kept in a textarea, debounced whenever I input something. It uses an API to get and send notes to the server. It has authentication so only I can use it. It's hardened with security features such as proper credential storage, proper security headers, rate limiting, etc.

## Technologies

The app uses vanilla HTML, CSS, and Javascript for the actual app, using XHR for the API calls. For the backend, the app uses an Express server with Express rate limiting and sessions. The notes are stored in a MySQL database, as well as the session data. The server is run by me, and a Cloudflare tunnel proxies all traffic.

## Deployment

On every Github push, there's an Action with two stages. The build stages wraps up everything into a Docker image and pushes it to my Dockerhub account. The deploy stage uses Cloudflare to reach my server, download the image, and deploy it. 
