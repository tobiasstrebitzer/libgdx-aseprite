import * as simplifyLine from 'line-simplify-rdp'
import * as traceRegion from 'marching-squares'
import { Options } from '..'
import { GetPixelFn, pixelFns } from './pixelFns'

export type InRegionFn = (x: number, y: number) => boolean

const DEFAULT_OPTIONS: Options = {
  opacityThreshold: 170,
  simplifyThreshold: 1,
  pixelFn: 'opaque'
}

export function getPoints(width: number, height: number, getPixel: GetPixelFn, opts: Partial<Options> = {}) {
  const { opacityThreshold, simplifyThreshold, pixelFn }: Options = { ...DEFAULT_OPTIONS, ...opts }
  if (!pixelFns[pixelFn]) { throw new Error('Invalid pixelFn') }
  const isInRegion: InRegionFn = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) { return false }
    return pixelFns[pixelFn](getPixel, x, y, opacityThreshold)
  }
  const startPoint = findEdgePoint(width, height, isInRegion)
  let polygon = traceRegion(startPoint.x, startPoint.y, isInRegion)
  if (simplifyThreshold >= 0) { polygon = simplifyLine(polygon, simplifyThreshold, true) }
  return polygon
}

export function findEdgePoint(width: number, height: number, isInRegion: InRegionFn) {
  // Start by trying the diagonal
  const max = Math.min(width, height)

  for (let xy = 0; xy < max; xy++) {
    if (isInRegion(xy, xy)) {
      return { x: xy, y: xy }
    }
  }

  // No in-region pixels along the main diagonal? OK, totally brute-force it
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (isInRegion(x, y)) {
        return { x: x, y: y }
      }
    }
  }
  throw new Error('No point found inside region!')
}
