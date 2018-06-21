import {spawn} from 'child_process'

export function runTs(code, input) {
  return new Promise(resolve => {
    let s = `
    const __logBuffer = []
    const __log = (m)=>__logBuffer.push(m)
    const __input = ${JSON.stringify(input) /* dont change this or you will break it */};
    ${code}
    const __result = {returnValue: main(__input, __log), log: __logBuffer}
    console.log(JSON.stringify(__result))
    `
    const tsNode = spawn('node', ['node_modules/ts-node/dist/bin', '--project', './tsconfig.json'])
    tsNode.stdin.write(s);
    tsNode.stdin.end()
    const status = {
      out: [],
      err: [],
      code: 0
    }
    tsNode.stdout.on('data', (data) => {
      status.out.push(data.toString())
    });

    tsNode.stderr.on('data', (data) => {
      status.err.push(data.toString())
      console.log('Error Running code: ***' + data + '***');
      console.log('Code was: ***' + s + '***');
    });

    tsNode.on('close', (code) => {
      status.code = code
      resolve(status)
    });
  })
}
