import { EditorView } from "@codemirror/view";

export function fontSizeExtension(fontSize: number) {
  return EditorView.theme({
    "&": { fontSize: `${fontSize}px` }, // font size for entire editor
    ".cm-content": { fontSize: `${fontSize}px` }, // content area
  });
}
