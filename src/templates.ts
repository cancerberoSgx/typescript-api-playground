import { readFileSync } from './readFileSync'
import { getExamples } from './examples'
import * as handlebars from 'handlebars'
import { mode } from './config'

let templates
export function getTemplates() {
  if (!templates || mode === 'development') {
    templates = {
      editorJs: handlebars.compile(readFileSync('./src/editor.js').toString()),
      indexHtml: handlebars.compile(readFileSync('./src/index.html').toString())
    }
  }
  return templates
}

let context
const libs = ['typescript.d.ts', 'ts-simple-ast.d.ts', 'node.d.ts', 'tsquery.d.ts']
export function getTemplatesContext() {
  const examples = getExamples()
  if (!context || mode === 'development') {
    context = {
      libs: libs.map(l => JSON.stringify([readFileSync(`./assets/declarations/${l}`).toString(), `libs/${l}`])),
      examples, 
      examplesString: JSON.stringify(examples)
    }
  }
  return context
}
