import * as ts from 'typescript'
export function main(code: string, log: (msg: string) => void) {
  const program = createProgram([
    { fileName: 'one.ts', content:`class Animal {
      constructor(public name: string) { }
      move(distanceInMeters: number = 0) {
        console.log(\`\${this.name} moved \${distanceInMeters}m.\`)
      }
    }
    class Snake extends Animal {
      constructor(name: string) { super(name); }
      move(distanceInMeters = 5) {
          console.log("Slithering...");
          super.move(distanceInMeters);
      }` },
    { fileName: 'two.ts', content: 'class A{color: string="red"; method2(l: Date[][]):number{if(l<new Date())return 1+1+1}}' },
    { fileName: 'third.ts', content: code }
  ])
  program.getSourceFiles().forEach(sourceFile => {
    log(`=== AST of ${sourceFile.fileName} ==`)
    visit(sourceFile, (n, level) => log(printNode(n, level)))
  })
}

function printNode (n: ts.Node, level: number = 0):string {
  const text = n.getText().replace(/[\\n\\s]+/gm, ' ')
  return`${new Array(level * 2).fill(' ').join('')}${getKindName(n.kind)} - "${text.substring(0, Math.min(text.length, 20))}`
}
/** creates a dummy ts.Program in memory with given source files inside */
export function createProgram(files: {
  fileName: string, content: string,
  sourceFile?: ts.SourceFile
}[], compilerOptions?: ts.CompilerOptions): ts.Program {
  const tsConfigJson = ts.parseConfigFileTextToJson('tsconfig.json',
    compilerOptions ? JSON.stringify(compilerOptions) :`{
    "compilerOptions": {
      "target": "es2018",   
      "module": "commonjs", 
      "lib": ["es2018"],
      "rootDir": ".",
      "strict": false,   
      "esModuleInterop": true,
    }
  `)
  let { options, errors } = ts.convertCompilerOptionsFromJson(tsConfigJson.config.compilerOptions, '.')
  if (errors.length) {
    throw errors
  }
  const compilerHost = ts.createCompilerHost(options)
  compilerHost.getSourceFile = function (fileName: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void, shouldCreateNewSourceFile?: boolean): ts.SourceFile | undefined {
    const file = files.find(f => f.fileName === fileName)
    if (!file) return undefined
    file.sourceFile = file.sourceFile || ts.createSourceFile(fileName, file.content, ts.ScriptTarget.ES2015, true)
    return file.sourceFile
  }
  return ts.createProgram(files.map(f => f.fileName), options, compilerHost)
}

function visit(node: ts.Node, visitor: (node: ts.Node, level: number) => void, level: number = 0) {
  if (!node) {
    return;
  }
  visitor(node, level);
  node.forEachChild(child => visit(child, visitor, level + 1));
}

function getKindName(kind: ts.SyntaxKind) {
  return (ts as any).SyntaxKind[kind];
}