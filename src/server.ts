import http from 'http'

//(process as any).isDevelopment = 

function onRequest(request, response) {
  const fn = require('./serverEval').fn
  fn(request, response)
}
const port = process.env.PORT || 8080
const url = process.env.PORT ? 'https://online-typescript-api-editor.glitch.me' : 'http://localhost:8080'
console.log('Server listening at '+url);
http.createServer(onRequest).listen(port)
