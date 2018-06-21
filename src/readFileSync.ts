import { readFileSync as realReadFileSync } from 'fs'

export function readFileSync(fileName: string) {
  return realReadFileSync(fileName)
}