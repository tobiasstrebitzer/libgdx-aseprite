import { readFileSync } from 'fs'
import * as Jimp from 'jimp'
import * as path from 'path'
import { Options } from '..'
import { AsepriteFrame, AsepriteJsonFrame } from './AsepriteFrame'

export interface AsepriteJson {
  frames: { [key: string]: AsepriteJsonFrame }
  meta: {
    app: string
    version: string
    image: string
    format: string
    size: { w: number, h: number }
    scale: string
    frameTags: { name: string, from: number, to: number, direction: string }[]
    layers: { name: string, opacity: number, blendMode: string }[]
    slices: unknown[]
  }
}

export interface AsepriteFindOptions {
  layer?: string
  tag?: string
  frame?: number
  name?: string
}

export class AsepriteDocument {
  readonly data: AsepriteJson
  private frames: Map<string, AsepriteFrame>
  private image!: Jimp

  constructor(private jsonPath: string) {
    this.data = JSON.parse(readFileSync(jsonPath, 'utf8'))
    this.frames = Object.entries(this.data.frames).reduce((map, [name, data]) => {
      map.set(name, new AsepriteFrame(this, name, data))
      return map
    }, new Map<string, AsepriteFrame>())
  }

  async load(options?: Partial<Options>) {
    this.image = await Jimp.read(this.imagePath)
    await Promise.all(this.getFrames().map((frame) => frame.load(options)))
  }

  extractRegion(x: number, y: number, width: number, height: number) {
    const region = new Jimp(width, height)
    return region.blit(this.image, 0, 0, x, y, width, height)
  }

  get imagePath() {
    return path.resolve(path.join(path.dirname(this.jsonPath), this.data.meta.image))
  }

  getFrame(options: AsepriteFindOptions = {}): AsepriteFrame | null {
    return this.getFrames(options)[0] || null
  }

  getFrames({ layer, tag, frame, name }: AsepriteFindOptions = {}): AsepriteFrame[] {
    return Array.from(this.frames.values()).filter((entry) => {
      if (layer != null && entry.layer !== layer) { return false }
      if (tag != null && entry.tag !== tag) { return false }
      if (frame != null && entry.frame !== frame) { return false }
      if (name != null && entry.name !== name) { return false }
      return true
    })
  }
}
