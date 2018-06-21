import * as fs from "fs";
import * as ts from "typescript";
function watch(rootFileNames: string[], options: ts.CompilerOptions) {
  const files: ts.MapLike<{ version: number }> = {}
  rootFileNames.forEach(fileName => {
    files[fileName] = { version: 0 }
  })
  const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => rootFileNames,
    getScriptVersion: (fileName) => files[fileName] && files[fileName].version.toString(),
    getScriptSnapshot: (fileName) => {
      if (!fs.existsSync(fileName)) {
        return undefined
      }
      return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString())
    },
    getCurrentDirectory: () => process.cwd(),
    getCompilationSettings: () => options,
    getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
  }
  const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry())
  rootFileNames.forEach(fileName => {
    emitFile(fileName)
    fs.watchFile(fileName,
      { persistent: true, interval: 250 },
      (curr, prev) => {
        if (+curr.mtime <= +prev.mtime) {
          return
        }
        files[fileName].version++
        emitFile(fileName)
      })
  })
  function emitFile(fileName: string) {
    let output = services.getEmitOutput(fileName)
    if (!output.emitSkipped) {
      console.log(`Emitting ${fileName}`)
    }
    else {
      console.log(`Emitting ${fileName} failed`)
      logErrors(fileName)
    }
    output.outputFiles.forEach(o => {
      fs.writeFileSync(o.name, o.text, "utf8")
    })
  }
  function logErrors(fileName: string) {
    let allDiagnostics = services.getCompilerOptionsDiagnostics()
      .concat(services.getSyntacticDiagnostics(fileName))
      .concat(services.getSemanticDiagnostics(fileName))
    allDiagnostics.forEach(diagnostic => {
      let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\\n")
      if (diagnostic.file) {
        let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!)
        console.log(`Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`)
      }
      else {
        console.log(`Error: ${message}`)
      }
    })
  }
}
const currentDirectoryFiles = fs.readdirSync(process.cwd()).
  filter(fileName => fileName.length >= 3 && fileName.substr(fileName.length - 3, 3) === ".ts")
watch(currentDirectoryFiles, { module: ts.ModuleKind.CommonJS })