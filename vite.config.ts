import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Cross-origin isolation. Required by the terminal that blocks on input():
// SharedArrayBuffer is only available on an isolated origin. Turning it on for
// dev as well as preview means an accidental cross-origin subresource fails
// here rather than in front of a learner.
const crossOriginIsolation = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
}

/**
 * Course content is chunked by being real modules, not by a bundler rule.
 *
 * Each module folder has a generated content.ts importing its own prose and
 * Python (scripts/gen-content-entries.mjs); loadModules imports those
 * dynamically, and ordinary code splitting does the rest. A chunking *rule*
 * over the individual files was tried first and is a trap: grouping chunks
 * that are already split turns them into static imports of the entry, so all
 * 81 projects download before the map paints and the split saves nothing.
 *
 * All that is left is to give those chunks their module's name, so a network
 * panel says which module was fetched rather than `content-a3f9.js`.
 */
function chunkName(id: string | undefined | null): string | null {
  const match = /src\/course\/modules\/([^/]+)\/content\.ts/.exec((id ?? '').replace(/\\/g, '/'))
  return match ? `content/${match[1]}` : null
}

export default defineConfig({
  // Set BASE_PATH=/repo/ when hosting from a subpath (GitHub Pages without a
  // custom domain). Vite rewrites index.html and the worker resolves the
  // Python runtime against it.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  worker: { format: 'es' },
  server: { headers: crossOriginIsolation },
  preview: { headers: crossOriginIsolation },
  // Pyodide ships a large .wasm; leave it in public and out of the bundle.
  assetsInclude: ['**/*.whl'],
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: (chunk) =>
          `assets/${chunkName(chunk.facadeModuleId) ?? '[name]'}-[hash].js`,
      },
    },
  },
})
