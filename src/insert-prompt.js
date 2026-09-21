// Insert a quick-prompt text into the DSH composer (a React-controlled
// contenteditable). execCommand('insertText') fires the input events React
// listens to, so the controlled state updates without direct DOM writes.
export function insertPromptIntoComposer(text) {
  const editor = document.querySelector('[contenteditable="true"]')
  if (!editor || !text) return false
  editor.focus()
  const sel = window.getSelection()
  sel.removeAllRanges()
  const range = document.createRange()
  range.selectNodeContents(editor)
  range.collapse(false)
  sel.addRange(range)
  let ok = false
  try { ok = document.execCommand('insertText', false, text) } catch { ok = false }
  if (!ok) {
    // fallback: a paste-shaped event pair
    const dt = new DataTransfer()
    dt.setData('text/plain', text)
    editor.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }))
  }
  return true
}
