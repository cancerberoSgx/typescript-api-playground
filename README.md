# TypeScript Compiler API online editor

Play with TypeScript compiler (and others) APIs online: [TypeScript Compiler API online playground](https://typescript-api-playground.glitch.me/)

(WIP)

# Objectives / Features

Basically is a server side node.js application that let the user input two TypeScript source files, one is its program using TypeScript compiler APIs and others, and the second is an example TypeScript source file that will be manipulated by the first program. Then the Program is evaluated server-side and the results are printed back to the browser (proabbly modifying the example source file)

 * It has lots of working examples using different TypeScript APIs and related libraries. 

 * Thanks to glitch infrastructure is online! https://typescript-api-playground.glitch.me/

 * Easily run in local host: `npm install && npm start & ; firefox localhost:8080`

 * Uses the great TypeScript monaco-editor so the experience is incredible

 * The idea is being able to point to users to these examples so they can play online with them when asking for help. 




# Notes / difficulties / learning

 * editor.js - is a handlebars template that contains big ibraries like typescript.d.ts embedded inside - now trying to migrate reading files and fixing production cache.

 * ts-simple-ast.d.ts needed little modification at the begginig of the heads (see comments ) and explicit declaration using compilerOptions path and baseUrl (see editor.js monaco.languages.typescript.typescriptDefaults.setCompilerOptions )
 
 * for typescript.d.ts to work we need to add the following to the top of the file:

```
declare module "typescript"{
    export = ts
}
```

 * tsquery.d.ts : had to run the following to join all .d.ts in one file :
  
  ```dts-generator --name tsquery --out package-name.d.ts --project /home/sg/git/tsquery```



# TODO

 * user being able to save / load its work - cheap solution like typescript playground use url parameters as source code input. Maybe a list in the server  in a file ? 

  * make some specs - like run server and post something to /run and expect some answer. In particular example code with string templates and different template quotes  like this: tsquery simple example

  * a help dialog or alert with minimal instructions

  * better example tagging and sorting

 * typechecking example using createProgram

 * nice idea: from input editor pass current cursor position / selected text range to main() so we can refactor it!

 * when selecting example reflect the change in the url

 * example of transpile -> transformation



# Dones : 

 * Production , performance, security: we are eval() and compiling / rendering templates on each request for fast development - we need a production mode that dont do this, caches everything in memory. 
 