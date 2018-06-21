import {readFileSync} from './readFileSync'
import {getExamples} from './getExamples'
export function compileTemplates() {
  const handlebars = require('handlebars')
  return {
    editorJs: handlebars.compile(readFileSync('./src/editor.js').toString()),
    indexHtml: handlebars.compile(readFileSync('./src/index.html').toString())
  }
}
export function getTemplatesContext() {
  const libs = ['typescript.d.ts', 'ts-simple-ast.d.ts', 'node.d.ts', 'tsquery.d.ts']
  const examples = getExamples()
  return {
    libs: libs.map(l => JSON.stringify([readFileSync(`./assets/declarations/${l}`).toString(), `libs/${l}`])),
    examples, examplesString: JSON.stringify(examples)
  }
}
