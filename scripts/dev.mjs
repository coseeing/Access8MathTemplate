import * as esbuild from 'esbuild';

import {
  buildCss,
  clean,
  copyPublic,
  esbuildOptions,
  out,
} from './pipeline.mjs';

await clean();
await Promise.all([buildCss(), copyPublic()]);

const ctx = await esbuild.context(esbuildOptions());
await ctx.watch();
const { host, port } = await ctx.serve({ servedir: out });
console.log(
  `Dev server: http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`
);
