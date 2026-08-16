// Shared build pipeline for the exported-website template, used by both
// build.mjs (one-shot, minified) and dev.mjs (watch + serve) so the two stay
// in lockstep instead of being hand-synced.
//
// The output format must stay `iife`: index.html loads main.js as a classic
// (non-module) script so the exported site also works over file://.
//
// Until see-mark 2.0.0 the bundle additionally needed a non-strict context and
// a `global` shim, because mathjax-full's asciimath legacy code used
// `arguments.callee` and the Node `global`. see-mark 2.0.0 dropped asciimath,
// so the shim is gone; only the remaining mathjax v3 code (tex→mml, mml→svg)
// is bundled and it needs neither.
//
// Output mirrors the old CRA layout so Access8MathWeb's ZIP injection is
// unchanged: build/index.html + build/static/js/main.js + build/static/css/main.css.
import { rm, mkdir, cp, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
export const out = path.join(root, 'build');

export const clean = async () => {
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });
};

export const buildCss = async () => {
  const css = await readFile(path.join(root, 'src/index.css'), 'utf8');
  const result = await postcss([tailwindcss, autoprefixer]).process(css, {
    from: path.join(root, 'src/index.css'),
    to: path.join(out, 'static/css/main.css'),
  });
  await mkdir(path.join(out, 'static/css'), { recursive: true });
  await writeFile(path.join(out, 'static/css/main.css'), result.css);
};

export const copyPublic = async () => {
  await cp(path.join(root, 'public'), out, { recursive: true });
};

export const esbuildOptions = ({ minify = false } = {}) => ({
  entryPoints: [path.join(root, 'src/main.js')],
  bundle: true,
  format: 'iife',
  minify,
  outfile: path.join(out, 'static/js/main.js'),
  logLevel: 'info',
});
