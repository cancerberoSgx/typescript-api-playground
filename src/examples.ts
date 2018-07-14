import { readFileSync } from './readFileSync'
import { mode } from './config';

let codeExamples
export function getExamples() {

  if (codeExamples && mode === 'production') {
    return codeExamples
  }
  
  codeExamples = [
    {
      name: 'TypeScript scanner',
      autoRun: true,
      description: 'Not very useful but shows Scanned API. Taken from <a href="https://basarat.gitbooks.io/typescript/content/docs/compiler/scanner.html">TypeScript book</a>',
      inputValue: `class A {
  color: string
  method (a: number, b: Date[][]): Promise<void> {
    return Promise.resolve()
  }
}
const a = new A()
      `,
      codeValue: `import * as ts from 'typescript'
// export a function main like this and the code at the right will be passed as parameter
export function main(code:string, log: (msg:string)=>void) {
  const scanner = ts.createScanner(ts.ScriptTarget.Latest,  true)
  scanner.setText(code)
  scanner.setOnError((message: ts.DiagnosticMessage, length: number) => {
    log('Error: '+message);
  })
  scanner.setScriptTarget(ts.ScriptTarget.ES5);
  scanner.setLanguageVariant(ts.LanguageVariant.Standard)
  let token = scanner.scan()
  while (token != ts.SyntaxKind.EndOfFileToken) {
    log( getKindName(token))
    token = scanner.scan()
  }
  return 'see the logs'
}
function getKindName(kind: ts.SyntaxKind) {
  return (ts as any).SyntaxKind[kind];
} 
  `},


    {
      name: 'Simple Transformation',
      description: 'Using TypeScript transformation API we change all property access expression like "foo.bar" so when "bar" has the name "accessorToBeRemoved" we leave only "foo". See how the example code changes after run it',
      replaceInputEditorContentWithReturnValue: true,
      inputValue: `const foo = {
  method1(s: any){}, 
  accessorToBeRemoved: 'red', 
  otherProperty: [true]
}
foo.method1(foo.otherProperty)
foo.method1(foo.accessorToBeRemoved)
foo.otherProperty = null
foo.accessorToBeRemoved = null
  `,

      codeValue: `import * as ts from 'typescript'
function main(source: string, log: (msg:string)=>void){
  const sourceFile: ts.SourceFile = ts.createSourceFile(
    'test.ts', source, ts.ScriptTarget.ES2015, true, ts.ScriptKind.TS
  );
  const printer: ts.Printer = ts.createPrinter();
  const result: ts.TransformationResult<ts.SourceFile> = ts.transform<ts.SourceFile>(
    sourceFile, [transformer]
  );
  const transformedSourceFile: ts.SourceFile = result.transformed[0];
  const newContent = printer.printFile(transformedSourceFile)
  result.dispose()
  return newContent
}
const transformer = <T extends ts.Node>(context: ts.TransformationContext) => {
  return (rootNode: T) => {
    function visit(node: ts.Node): ts.Node {
      node = ts.visitEachChild(node, visit, context);
      // in a property access expression like "foo.bar" "foo" is the expression and "bar" is the name : 
      // we replace the whole expression with just node.expression in the case name is "accessorToBeRemoved"
      if (ts.isPropertyAccessExpression(node) && node.name &&
        node.name.getText() === 'accessorToBeRemoved') {
        return node.expression
      }
      return node;
    }
    return ts.visitNode(rootNode, visit);
  }
}
  `
    },

    {
      name: 'Transformation 2',
      description: 'More complex example of using TypeScript Transformation API. See comments in the code for details. Heads up, the example sources changes after run completes.',
      replaceInputEditorContentWithReturnValue: true,
      inputValue: `class Foo {
  magic2(s: number) {
    return s + 5 + 50 + 11 + 99 * 8 * 7 / s
  }
}
const value = new Foo().magic2(1 + 2 + 3)`,
      codeValue: readFileSync('./assets/examples/ts-transformation-2/code.ts').toString()
    },


    {
      name: 'Transformation 3',
      description: 'Another Transformation API example that will add new nodes, this time putting a name to functions declared without name',
      replaceInputEditorContentWithReturnValue: true,
      inputValue: `function(a: number):[number]{
  return [Math.PI*a/2]
}
function named(b:string){
  function():string {return ''}
  return 123
}
const alsoWithName = function(){
  return function(){} // let's see what happens with this one
}; 
(function (a: number) { return a + 1; })(5); // and with this one
  `,
      codeValue: `import * as ts from 'typescript';
// since having function declarations without name is an error in TypeScript this transformation will put them name
function main(source: string, log: (m: string)=>void):string {
  let nameCounter = 0
  const transformFactory = (context: ts.TransformationContext) => (rootNode: ts.SourceFile): ts.SourceFile => {
    const visit = (node: ts.Node) => {
      node = ts.visitEachChild(node, visit, context);
      if (ts.isFunctionDeclaration(node) && (!node.name || !node.name.escapedText)) {
        // we can actually change the node using two techniques, the first one is creating a new mutable 
        // clone and modify it and return it
        const clone = ts.getMutableClone(node)
        clone.name = ts.createIdentifier('unnamedFunc'+nameCounter++)
        return clone
        
        // or also we could create a new node using the ts.create* functions : 

        // return ts.createFunctionDeclaration(node.decorators, node.modifiers, node.asteriskToken,
        //   ts.createIdentifier('unnamedFunc'), node.typeParameters, node.parameters, node.type, node.body)
      }
      return node
    }
    return ts.visitNode(rootNode, visit)
  }
  const sourceFile = ts.createSourceFile(
    'test.ts', source, ts.ScriptTarget.ES2015, true, ts.ScriptKind.TS
  )
  const result = ts.transform(sourceFile, [transformFactory])
  const transformedContent = ts.createPrinter().printFile(result.transformed[0])
  log('Nodes changed : '+nameCounter)
  return transformedContent
}
  `
    },

    {

      name: 'Build and print AST programmatically',
      description: 'Using TypeScript Compiler API to "write" code by creating a AST from code data-structures. Prints the result out, in this case, a working factorial function, taken from <a href="https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#user-content-creating-and-printing-a-typescript-ast">TypeScript Compiler API docs</a>',
      replaceInputEditorContentWithReturnValue: true,
      inputValue: ``,
      codeValue: readFileSync('./assets/examples/ts-build-and-print-ast/code.ts').toString()
    },


    {

      name: 'Transpiling-a-single-file',
      description: 'Using TypeScript Compiler API To transpile a single file to JavaScript. Tken from <a href="https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#transpiling-a-single-file">TypeScript Compiler API docs</a>',
      replaceInputEditorContentWithReturnValue: true,
      inputValue: `import {foo} from 'foo'
export const f = (obj: {d: boolean}): {a: number, b: Date, d:boolean} => {
  for(let d of [new Date()]){
    foo(d)
  }
  return {a: 1, b: new Date(), ... obj}
}`,
      codeValue: `import * as ts from 'typescript';
function main(source: string, log: (m: string) => void): string {
  var compilerOptions = { module: ts.ModuleKind.System };
  var res1 = ts.transpileModule(source, { compilerOptions: compilerOptions, moduleName: "myModule2" });
  log(res1.outputText);
  log("============")
  var res2 = ts.transpile(source, compilerOptions, /*fileName*/ undefined, /*diagnostics*/ undefined, /*moduleName*/ "myModule1");
  log(res2);
  return res2
}`
    },

    {
      name: 'tsquery simple example',
      autoRun: true,
      description: 'Using <a href="https://github.com/phenomnomnominal/tsquery">tsquery library</a> to count Identifiers with a certain name',
      inputValue: `class Animal {
  constructor(public name: string) { }
  move(distanceInMeters: number = 0) {
    console.log( \`\${this.name} moved \${distanceInMeters}m.\`)
  }
}
class Snake extends Animal {
  constructor(name: string) { super(name); }
  move(distanceInMeters = 5) {
      console.log("Slithering...");
      super.move(distanceInMeters);
  }
}`,
      codeValue: `import { tsquery } from '@phenomnomnominal/tsquery';
function main(source: string, log: (m: string) => void): string | void {
  const ast = tsquery.ast(source);
  const nodes = tsquery(ast, 'Identifier[name="Animal"]');
  log(\`Identifier[name="Animal"] count: \${nodes.length}\`);
}`
    },

    {
      name: 'Creating a ts.Program and SourceFile in memory for testing without file system',
      description: 'Ideal for testing or using APIs in memory. Also, a small mostration on how to navegate the AST',
      autoRun: true,
      inputValue: readFileSync('./assets/examples/ts-create-program-without-fs/input.ts').toString(),
      codeValue: readFileSync('./assets/examples/ts-create-program-without-fs/code.ts').toString()
    },

    {
      name: 'ts-simple-ast rename a lot',
      description: 'Example using <a href="https://github.com/dsherret/ts-simple-ast">ts-simple-ast</a> rename() tool - will rename randomly almost every identifier found in the input. Very crazy and heuristic - don\'t try this at home!',
      replaceInputEditorContentWithReturnValue: true,
      inputValue: readFileSync('./assets/examples/tsa-rename-test1/input.ts').toString(),
      codeValue: readFileSync('./assets/examples/tsa-rename-test1/code.ts').toString()
    },

    {
      name: 'ts-type-checking-source',
      description: 'walk the AST and use the checker to serialize class information. Use the type checker to get symbol and type information, while grabbing JSDoc comments for exported classes, their constructors, and respective constructor parameters. Example adapted from <a href="https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#using-the-type-checker">TypeScript Compiler API docs</a>',
      replaceInputEditorContentWithReturnValue: true,
      inputValue: readFileSync('./assets/examples/ts-type-checking-source/input.ts').toString(),
      codeValue: readFileSync('./assets/examples/ts-type-checking-source/code.ts').toString()
    },


    {
      name: 'tsquery support for ts-simple-ast',
      description: 'Using ts-simple-ast and tsquery together : https://gist.github.com/dsherret/826fe77613be22676778b8c4ba7390e7',
      // replaceInputEditorContentWithReturnValue: true,
      autoRun: true,
      inputValue: readFileSync('./assets/examples/tsSimpleAstAndTsQuery/input.ts').toString(),
      codeValue: readFileSync('./assets/examples/tsSimpleAstAndTsQuery/code.ts').toString()
    }, 
  ] as Example[]

  return codeExamples
} 

export interface Example {
  name: string, 
  description: string,
  inputValue: string, 
  codeValue: string,
  replaceInputEditorContentWithReturnValue?: boolean
  autoRun?: boolean
}