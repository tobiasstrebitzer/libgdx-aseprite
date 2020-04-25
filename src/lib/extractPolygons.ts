import * as getPixels from 'get-pixels'
import { Point } from 'marching-squares'
import { Options } from '..'
import { getPoints } from './utils'
import ndarray = require('ndarray')

export type Polygon = Point[]

function extractPolygonsRecursive(pixels: ndarray, options: Partial<Options>, polygons: Polygon[] = []): Polygon[] {
  try {
    const points = getPoints(pixels.shape[0], pixels.shape[1], pixels.get.bind(pixels), options)
    polygons.push(points)

    const rect = {
      x1: points.reduce((x: number, point: Point) => point.x < x ? point.x : x, Infinity),
      x2: points.reduce((x: number, point: Point) => point.x > x ? point.x : x, 0),
      y1: points.reduce((y: number, point: Point) => point.y < y ? point.y : y, Infinity),
      y2: points.reduce((y: number, point: Point) => point.y > y ? point.y : y, 0)
    }
    for (let x = rect.x1; x <= rect.x2; x += 1) {
      for (let y = rect.y1; y <= rect.y2; y += 1) {
        pixels.set(x, y, 0, 0)
        pixels.set(x, y, 1, 0)
        pixels.set(x, y, 2, 0)
        pixels.set(x, y, 3, 0)
      }
    }
    return extractPolygonsRecursive(pixels, options, polygons)
  } catch (error) {
    return polygons
  }
}

export async function extractPolygons(buffer: Buffer, mimeType: string, options: Partial<Options> = {}) {
  const pixels: ndarray = await new Promise((resolve, reject) => {
    getPixels(buffer, mimeType, (error: Error, result: ndarray) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
  if (pixels.shape.length !== 3 || pixels.shape[2] !== 4) { throw new Error('Image must be a normal RGBA image.') }
  return extractPolygonsRecursive(pixels, options)
}
