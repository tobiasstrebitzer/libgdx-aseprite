import { Options } from '..'
import { AsepriteDocument } from './AsepriteDocument'
import { extractPolygons, Polygon } from './extractPolygons'
import Jimp = require('jimp/*')

export interface AsepriteJsonFrame {
  frame: { x: number, y: number, w: number, h: number }
  rotated: boolean
  trimmed: boolean
  spriteSourceSize: { x: number, y: number, w: number, h: number }
  sourceSize: { w: number, h: number }
  duration: number
  meta?: AsepriteFrameMeta
}

export interface AsepriteFrameMeta {
  polygons: Polygon[]
  layer: string
  tag: string
  index: number
}

export class AsepriteFrame {
  readonly layer: string
  readonly tag: string
  readonly frame: number
  private image: Jimp

  polygons: Polygon[]

  constructor(private document: AsepriteDocument, readonly name: string, readonly data: AsepriteJsonFrame) {
    const [layer, tag, frame] = name.split(':')
    this.layer = layer
    this.tag = tag
    this.frame = +frame
  }

  async load(options?: Partial<Options>) {
    const { x, y, width, height } = this
    this.image = this.document.extractRegion(x, y, width, height)
    const buffer = await this.getBuffer()
    this.polygons = await extractPolygons(buffer, 'image/png', options)
  }

  getBuffer() {
    return this.image.getBufferAsync('image/png')
  }

  get x() { return this.data.frame.x }
  get y() { return this.data.frame.y }
  get width() { return this.data.frame.w }
  get height() { return this.data.frame.h }
  get rotated() { return this.data.rotated }
  get trimmed() { return this.data.trimmed }
  get spriteSourceSize() { const { x, y, w, h } = this.data.spriteSourceSize; return { x, y, width: w, height: h } }
  get sourceSize() { const { w, h } = this.data.sourceSize; return { width: w, height: h } }
  get duration() { return this.data.duration }
  get index() { return this.frame }

  get meta() {
    const { polygons, layer, tag, index } = this
    return { polygons, layer, tag, index }
  }
}
