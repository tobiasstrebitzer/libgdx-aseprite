#!/usr/bin/env node
import { command } from 'yargs'
import { convert, Options } from '..'

/* eslint-disable-next-line no-unused-expressions */
command('convert [path]', 'Convert Aseprite JSON', (yargs) => {
  yargs.positional('path', { describe: 'Path to Aseprite JSON' })
  yargs.option('opacityThreshold', { alias: 'o', default: 170, type: 'number' })
  yargs.option('simplifyThreshold', { alias: 's', default: 1, type: 'number' })
  yargs.option('pixelFn', { alias: 'p', default: 'opaque', type: 'string' })
}, ({ path, opacityThreshold, simplifyThreshold, pixelFn }: Options & { path: string }) => {
  console.log(`converting ${path}`)
  convert(path, { opacityThreshold, simplifyThreshold, pixelFn }).then(() => {
    console.info('~> completed')
  }).catch(console.error)
}).argv
