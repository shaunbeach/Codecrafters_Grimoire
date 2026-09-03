import { useMemo } from 'react'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js/lib/core'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import sql from 'highlight.js/lib/languages/sql'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml'

hljs.registerLanguage('python', python)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('json', json)
hljs.registerLanguage('html', xml)

// Fenced blocks with no language are overwhelmingly terminal output in these
// lectures, so leave those unhighlighted rather than guessing.
const marked = new Marked(
  { gfm: true },
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, language) {
      if (!language || !hljs.getLanguage(language)) return code
      return hljs.highlight(code, { language }).value
    },
  }),
)

/**
 * All course prose goes through here. The text ships with the app, so there is
 * no untrusted HTML — but everything a learner reads (lessons, briefs and
 * hints) must use the same renderer, or one of them silently ends up showing
 * its own backticks.
 */
export function Markdown({ markdown, className = 'prose-lesson' }: {
  markdown: string
  className?: string
}) {
  const html = useMemo(() => marked.parse(markdown) as string, [markdown])
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

export function Lecture({ markdown }: { markdown: string }) {
  return <Markdown markdown={markdown} />
}
