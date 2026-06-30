import * as esbuild from 'esbuild';

import { buildCss, clean, copyPublic, esbuildOptions } from './pipeline.mjs';

await clean();
await Promise.all([
  buildCss(),
  esbuild.build(esbuildOptions({ minify: true })),
  copyPublic(),
]);
console.log('Build complete → build/');
