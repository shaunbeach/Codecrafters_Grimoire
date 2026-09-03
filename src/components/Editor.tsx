import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { EditorView, keymap } from '@codemirror/view'
import { indentUnit } from '@codemirror/language'
import { Prec } from '@codemirror/state'

const wrapping = EditorView.theme({
  '&': { fontSize: '13.5px', height: '100%' },
  '.cm-scroller': {
    fontFamily: 'var(--font-mono)',
    lineHeight: '1.65',
    padding: '12px 0',
  },
  '.cm-content': { paddingBottom: '40vh' },
  '&.cm-focused': { outline: 'none' },
  '.cm-gutters': { background: 'transparent', border: 'none', paddingRight: '6px' },
  '.cm-activeLine': { background: 'rgba(255,255,255,0.035)' },
  '.cm-activeLineGutter': { background: 'transparent' },
})

interface Props {
  value: string
  onChange: (value: string) => void
  onRun: () => void
  disabled?: boolean
}

export function Editor({ value, onChange, onRun, disabled }: Props) {
  // Prec.highest so Cmd/Ctrl+Enter beats CodeMirror's own bindings.
  const runKey = Prec.highest(
    keymap.of([{ key: 'Mod-Enter', preventDefault: true, run: () => (onRun(), true) }]),
  )

  return (
    <div className="editor">
      <CodeMirror
        value={value}
        theme={vscodeDark}
        height="100%"
        editable={!disabled}
        extensions={[python(), indentUnit.of('    '), wrapping, runKey]}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: true,
          autocompletion: true,
          bracketMatching: true,
          closeBrackets: true,
          tabSize: 4,
        }}
        onChange={onChange}
      />
    </div>
  )
}
