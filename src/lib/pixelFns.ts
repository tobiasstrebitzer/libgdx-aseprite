export type PixelFnName = 'opaque' | 'notWhite' | 'notBlack'
export type GetPixelFn = (x: number, y: number, z: number) => number
export type PixelFn = (getPixel: GetPixelFn, x: number, y: number, threshold: number) => boolean

export const opaque: PixelFn = (getPixel: GetPixelFn, x: number, y: number, threshold: number) => {
  return getPixel(x, y, 3) >= threshold
}

export const notWhite: PixelFn = (getPixel: GetPixelFn, x: number, y: number, threshold: number) => {
  const lum = 0.299 * getPixel(x, y, 0) + 0.587 * getPixel(x, y, 1) + 0.114 * getPixel(x, y, 2)
  return lum <= threshold
}

export const notBlack: PixelFn = (getPixel: GetPixelFn, x: number, y: number, threshold: number) => {
  const lum = 0.299 * getPixel(x, y, 0) + 0.587 * getPixel(x, y, 1) + 0.114 * getPixel(x, y, 2)
  return lum >= threshold
}

export const pixelFns: { [key in PixelFnName]: PixelFn } = { opaque, notWhite, notBlack }
