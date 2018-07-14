
var typeScriptCodeEditor, exampleCodeEditor
 

// code examples

const codeExamples = {{{examplesString}}};
function changeExample(name){
  const found = codeExamples.find(e=>e.name===name)
  if(!found){
    alert('Example not found: '+name)
    return 
  }
  example = found
  typeScriptCodeEditor.setValue(example.codeValue)
  exampleCodeEditor.setValue(example.inputValue)
  location.hash=`example=${encodeURIComponent(example.name)}`
  typeScriptCodeRun()
}
const hashEditorInputPrefix = '__editor_input__='
const hashEditorCodePrefix = '__editor_code__='
let example

function setExampleFromUrlParameter(){
  const url = new URL(location.href)

  const exampleIndex = url.searchParams.get("example")|| undefined
    example = exampleIndex!==undefined ? codeExamples[exampleIndex] : undefined
  if(example){return}

  example = codeExamples.find(e=>decodeURIComponent(url.searchParams.get("example"))===e.name)
  if(example){return}

  example = codeExamples.find(e=>decodeURIComponent(url.hash.split('#example=').length===2 ? url.hash.split('#example=')[1] : '')===e.name)
  if(example){return}

  const code = url.hash.includes(hashEditorCodePrefix) ? url.hash.substring(url.hash.indexOf(hashEditorCodePrefix)+hashEditorCodePrefix.length, url.hash.includes(hashEditorInputPrefix) ? url.hash.indexOf(hashEditorInputPrefix) : url.hash.length) : undefined
  let input = code && url.hash.includes(hashEditorInputPrefix) ? url.hash.substring(url.hash.indexOf(hashEditorInputPrefix)+hashEditorInputPrefix.length, url.hash.length) : undefined
  if(code){
    example = {
      name: 'custom example', 
      description: 'custom example - data came from url', 
      inputValue: decodeURIComponent(input || ''),
      codeValue: decodeURIComponent(code)
    }
    return 
  }
  example = codeExamples[0]
}

function setWorkingAnimation(working){
  document.getElementById('working-animation').style.display = working ? 'inline-block' : 'none'
}


function buildUrl() {
  const code = encodeURIComponent(typeScriptCodeEditor.getValue())
  const input = encodeURIComponent(exampleCodeEditor.getValue())
  location.hash = hashEditorCodePrefix + code + hashEditorInputPrefix + input
}



// run typescript code handlers

function typeScriptCodeRun(){
  const body = {
    input: exampleCodeEditor.getModel().getValue(), 
    code: typeScriptCodeEditor.getModel().getValue()
  }
  setWorkingAnimation(true)
  fetch('/run', {method: 'post', body: JSON.stringify(body)})
    .then(response=>response.blob())
    .then(blob=>{
      return new Promise(resolve=>{
        const reader = new FileReader() 
        reader.readAsText(blob)
        if(!reader.result && !reader.result.toString()){
          reader.addEventListener("loadend", () => {
            resolve(reader.result.toString())
          })
        }
        else{
          resolve(reader.result.toString())
        }
      })
    })
    .catch(ex=>{
      setWorkingAnimation(false)
      alert('Error in the server: ' + ex)
      throw ex
    })
  .then(responseData=>{
    const {result, text} = formatResult(responseData)
    document.getElementById('result').innerText = text
    if(result.out && result.out.returnValue && example.replaceInputEditorContentWithReturnValue){
      exampleCodeEditor.setValue(result.out.returnValue)
    }
    setWorkingAnimation(false)
  })
  .catch(ex=>{
    setWorkingAnimation(false)
    alert('Error parsing response: ' + ex)
    throw ex
  })
  
}

function formatResult(text){
  let result 
  try {
  result = JSON.parse(text)
  if(!result.out||result.out.length===0){
    result.out = ['{"log": [], "returnValue": ""}']
  }
  result.out=JSON.parse(result.out[0])
  }catch(ex){
    console.log( 'Invalid JSON: **' + text + '**')
    throw ex
  }
  return {
    result, 
    text: `RETURN VALUE: 
${result.out.returnValue}

STDOUT: 
${result.out.log.join('\n')}

EXIT CODE: 
${result.code}

STDERR: 
${result.err.join('\n')}
`
  }
}



// editor creation / configuration

require(["vs/editor/editor.main"], function () {
  
  setExampleFromUrlParameter()
  
  // compiler options
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES6,
      module: "commonjs",
      lib: ["es2018"],
      allowNonTsExtensions: true ,
      strict: false,
      rootDir: ".",
      paths: {
        "ts-simple-ast":["libs/ts-simple-ast.d.ts"] // needed for monaco to support ts-simple-ast.d.ts since doesn't declare a module
      },
      baseUrl: "."
  })
  
  // loading libraries
  {{#each libs}}
  monaco.languages.typescript.typescriptDefaults.addExtraLib.apply(  monaco.languages.typescript.typescriptDefaults, {{{this}}})
  {{/each}}
  
  const editorOptions = {
    fontSize: '12px',
    language: 'typescript', 
    minimap: {enabled: false}
  }

  const typeScriptCodeContainer = document.getElementById('typeScriptCodeContainer')
  typeScriptCodeEditor = monaco.editor.create(typeScriptCodeContainer, Object.assign(editorOptions, {value: example.codeValue}))
  installResizeWatcher(typeScriptCodeContainer, typeScriptCodeEditor.layout.bind(typeScriptCodeEditor), 2000)
  const exampleCodeContainer = document.getElementById('exampleCodeContainer')
  exampleCodeEditor = monaco.editor.create(exampleCodeContainer, Object.assign(editorOptions, {value: example.inputValue}))
  installResizeWatcher(exampleCodeContainer, exampleCodeEditor.layout.bind(exampleCodeEditor), 2000)

  if(example.autoRun){
    typeScriptCodeRun()
  }
})

function installResizeWatcher(el, fn, interval){
  let offset = {width: el.offsetWidth, height: el.offsetHeight}
  setInterval(()=>{
    let newOffset = {width: el.offsetWidth, height: el.offsetHeight}
    if(offset.height!=newOffset.height||offset.width!=newOffset.width){
      offset = newOffset
      fn()
    }
  }, interval)
}