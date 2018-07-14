import { readFileSync } from './readFileSync'
import { getExamples } from './examples'
import * as handlebars from 'handlebars'
import { mode } from './config'
import minify from 'minify-fast'

let templates
export function getTemplates() {
  if (!templates || mode === 'development') {
    templates = {
      editorJs: handlebars.compile(readFileSync('./src/editor.js')),
      indexHtml: handlebars.compile(readFileSync('./src/index.html'))
    }
    const oldEditorJs = templates.editorJs
    templates.editorJs = context => minify({code: oldEditorJs(context)})
  }
  return templates
}

let content = {}
export function renderTemplate(template, context) {
  if (!content[template] || mode === 'development') {
    content[template] = getTemplates()[template](context)
  }
  return content[template]
}

let context
const libs = ['typescript.d.ts', 'ts-simple-ast.d.ts', 'node.d.ts', 'tsquery.d.ts']
export function getTemplatesContext() {
  if (!context || mode === 'development') {
    const examples = getExamples()
    context = {
      libs: libs.map(l => JSON.stringify([readFileSync(`./assets/declarations/${l}`), `libs/${l}`])),
      examples, 
      examplesString: JSON.stringify(examples)
    }
  }
  return context
}
