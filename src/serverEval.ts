import {runTs} from './runTs'
import {compileTemplates, getTemplatesContext} from './templates'

/*
heads up! It is the server implementation required by Server.ts on each request so responses changes per-request. Is mostly responsible of: 

 * know where all the files are (templates, example files, declaration files)
 * compile and render templates (index.htl and editor.js) that are consumer on the front end
 * on development mode this happens on each request on production templates and files reading is cached
*/

export function fn(request, response){
  const templates = compileTemplates()
  const templatesContext = getTemplatesContext()
  if(request.url==='/editor.js'){
    const result = templates.editorJs(templatesContext)
    response.writeHead(200, {"Content-Type": "text/javascript"})
    response.write(result)
    response.end()
  }
  else if(request.url==='/run'){
    let body = ''
    request.on('data', function(chunk) {
      body += chunk.toString()
    });
    request.on('end', function() {
      const {code, input} = JSON.parse(body)
      runTs(code, input).then(result=>{
        response.writeHead(200, "OK", {'Content-Type': 'text/text'});
        response.write(JSON.stringify(result))
        response.end();
      })
    });
  }
  else{
    response.writeHead(200, {"Content-Type": "text/html"})
    const result = templates.indexHtml(templatesContext)
    response.write(result)
    response.end()
  }
}
