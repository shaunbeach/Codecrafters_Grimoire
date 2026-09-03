// Stand-in modules, pulled in as raw text at build time. The worker hands the
// source to Python, which registers it in sys.modules under the real library's
// name. Node's verification scripts read the same .py files off disk.
const sources = import.meta.glob('./*.py', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const STUB_SOURCES: Record<string, string> = Object.fromEntries(
  Object.entries(sources).map(([path, source]) => [
    path.replace(/^\.\//, '').replace(/\.py$/, ''),
    source,
  ]),
)
