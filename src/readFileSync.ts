import { readFileSync as realReadFileSync } from 'fs'
import { mode } from './config'

const cache: { [key: string]: string } = {}
export function readFileSync(fileName: string): string {
  if (mode === 'development') {
    return realReadFileSync(fileName).toString()
  }
  if (!cache[fileName]) {
    cache[fileName] = realReadFileSync(fileName).toString()
  }
  return cache[fileName]
}