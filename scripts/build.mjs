// Build script for the exported-website template.
//
// We use esbuild (not Vite/Rollup) because the bundle includes mathjax-full,
// whose asciimath legacy code requires a NON-STRICT, classic-script bundle with
// a `global` shim. esbuild's iife output (no implicit "use strict", and it
// resolves the mathjax global correctly) satisfies this; Rollup did not.
//
// Output mirrors the old CRA layout so Access8MathWeb's ZIP injection is
// unchanged: build/index.html + build/static/js/main.js + build/static/css/main.css.
import { rm, mkdir, cp, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import * as esbuild from 'esbuild';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'build');

const buildCss = async () => {
  const css = await readFile(path.join(root, 'src/index.css'), 'utf8');
  const result = await postcss([tailwindcss, autoprefixer]).process(css, {
    from: path.join(root, 'src/index.css'),
    to: path.join(out, 'static/css/main.css'),
  });
  await mkdir(path.join(out, 'static/css'), { recursive: true });
  await writeFile(path.join(out, 'static/css/main.css'), result.css);
};

const buildJs = async () => {
  await esbuild.build({
    entryPoints: [path.join(root, 'src/main.js')],
    bundle: true,
    format: 'iife',
    minify: true,
    // mathjax-full's asciimath legacy references the Node `global`.
    define: { global: 'globalThis' },
    outfile: path.join(out, 'static/js/main.js'),
    logLevel: 'info',
  });
};

const copyPublic = async () => {
  // Verbatim copy of public/ to build root (index.html, content-config.js
  // placeholder, images/, manifest.json, ...).
  await cp(path.join(root, 'public'), out, { recursive: true });
};

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await Promise.all([buildCss(), buildJs(), copyPublic()]);
console.log('Build complete → build/');
