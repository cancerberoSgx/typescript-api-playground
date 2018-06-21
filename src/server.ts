import http from 'http'

import { runTs } from './runTs'
import { getTemplates, getTemplatesContext } from './templates'
import { port, url } from './config'

function onRequest(request, response) {
  const templates = getTemplates()
  const templatesContext = getTemplatesContext()
  if (request.url === '/editor.js') {
    const result = templates.editorJs(templatesContext)
    response.writeHead(200, { "Content-Type": "text/javascript" })
    response.write(result)
    response.end()
  }
  else if (request.url === '/run') {
    let body = ''
    request.on('data', function (chunk) {
      body += chunk.toString()
    });
    request.on('end', function () {
      const { code, input } = JSON.parse(body)
      runTs(code, input).then(result => {
        response.writeHead(200, "OK", { 'Content-Type': 'text/text' });
        response.write(JSON.stringify(result))
        response.end();
      })
    });
  }
  else {
    response.writeHead(200, { "Content-Type": "text/html" })
    const result = templates.indexHtml(templatesContext)
    response.write(result)
    response.end()
  }
}

console.log('Server listening at ' + url);

http.createServer(onRequest).listen(port)
