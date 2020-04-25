import { writeFileSync } from 'fs'
import { AsepriteDocument } from './lib/AsepriteDocument'
import { PixelFnName } from './lib/pixelFns'

export interface Options {
  opacityThreshold: number
  simplifyThreshold: number
  pixelFn: PixelFnName
}

export async function convert(path: string, { opacityThreshold, simplifyThreshold, pixelFn }: Options) {
  const document = new AsepriteDocument(path)
  await document.load({ opacityThreshold, simplifyThreshold, pixelFn })
  const data = { ...document.data }
  for (const [name, frameData] of Object.entries(data.frames)) {
    frameData.meta = document.getFrame({ name })!.meta
  }
  writeFileSync(path, JSON.stringify(data, null, 2))
}
