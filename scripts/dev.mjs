// Dev server: builds CSS + copies public once, then runs esbuild in watch mode
// and serves the build/ directory. Mirrors the production build's esbuild
// pipeline so dev and prod behave identically.
import { rm, mkdir, cp, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import * as esbuild from 'esbuild';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'build');

await rm(out, { recursive: true, force: true });
await mkdir(path.join(out, 'static/css'), { recursive: true });
await cp(path.join(root, 'public'), out, { recursive: true });

const css = await readFile(path.join(root, 'src/index.css'), 'utf8');
const result = await postcss([tailwindcss, autoprefixer]).process(css, {
  from: path.join(root, 'src/index.css'),
  to: path.join(out, 'static/css/main.css'),
});
await writeFile(path.join(out, 'static/css/main.css'), result.css);

const ctx = await esbuild.context({
  entryPoints: [path.join(root, 'src/main.js')],
  bundle: true,
  format: 'iife',
  define: { global: 'globalThis' },
  outfile: path.join(out, 'static/js/main.js'),
  logLevel: 'info',
});

await ctx.watch();
const { host, port } = await ctx.serve({ servedir: out });
console.log(`Dev server: http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`);
