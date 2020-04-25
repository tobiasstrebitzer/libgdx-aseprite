declare module 'marching-squares' {
  export interface Point { x: number, y: number }
  function traceRegion(x: number, y: number, fn: (x: number, y: number) => boolean): Point[]
  export = traceRegion
}
