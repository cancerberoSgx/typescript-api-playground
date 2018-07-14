import { tsquery } from '@phenomnomnominal/tsquery'
import Project, { Node, FunctionDeclaration, ParameterDeclaration } from 'ts-simple-ast'
import { ok } from 'assert';

function query<T extends Node = Node>(node: Node, q: string): T[] {
  // https://gist.github.com/dsherret/826fe77613be22676778b8c4ba7390e7
  return tsquery(node.compilerNode, q)
    .map(n => ((node as any).getNodeFromCompilerNode(n) as T))
}
function queryOne<T extends Node = Node>(node: Node, q: string): T | undefined {
  const results = query<T>(node, q)
  return results.length ? results[0] : undefined
}

export function main(source: string, log: (msg: string) => void): string {
  source = `
  interface Person{}
  function f(n:number, p: Person): Person {}
  function g(n: Person):Person[] {}
`
  const project = new Project({ useVirtualFileSystem: true })
  const sourceFile = project.createSourceFile('test.ts', source)

  let f = queryOne<FunctionDeclaration>(sourceFile, functionDeclarationReturningTypeQuery({type: 'Person'}))
  assertIncludes(f.getText(), `function f(n:number, p: Person): Person`)

  f.addParameter({ name: 'a', type: 'Person[][]' })
  f = queryOne<FunctionDeclaration>(sourceFile, functionDeclarationReturningTypeQuery({type: 'Person'}))
  assertIncludes(f.getText(), `function f(n:number, p: Person, a: Person[][]): Person {}`)

  const paramA = queryOne<ParameterDeclaration>(f, parameterQuery({name: 'a', type: 'Person'}))
  assertIncludes(paramA.getText(), `a: Person[][]`)
  return 'bye'
}

const parameterQuery = ({name, type}: {name: string, type: string}) => `Parameter:has(Parameter>Identifier[name="${name}"]):has(Parameter>ArrayType>ArrayType>${typeQuery({type})})`

const typeQuery = ({type}: {type: string})=>`TypeReference>Identifier[name="${type}"]`

const functionDeclarationReturningTypeQuery = ({type}: {type: string}) => `FunctionDeclaration:has(FunctionDeclaration>${typeQuery({type})})`

const assertIncludes = (a, b, msg:string='') => ok(a.includes(b), msg)

// main('', console.log)