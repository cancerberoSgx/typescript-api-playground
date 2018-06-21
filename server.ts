import * as fs from 'fs'
import http from 'http'

//(process as any).isDevelopment = true

//function readFileSync(name){
  //if((process as any).isDevelopment){
//    return fs.readFileSync
  //}
//}

function onRequest(request, response) {
  const readFileSync = require('fs').readFileSync
  const fn = eval(` ( ${readFileSync('./serverEval.ts').toString()} )`)
  fn(request, response, readFileSync)
}
const port = process.env.PORT || 8080
const url = process.env.PORT ? 'https://online-typescript-api-editor.glitch.me' : 'http://localhost:8080'
console.log('Server listening at '+url);
http.createServer(onRequest).listen(port)
