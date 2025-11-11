import { memo, useEffect, useRef, type RefObject } from "react";
import {
  EditorView,
  highlightActiveLine,
  lineNumbers,
  keymap,
} from "@codemirror/view";
import { EditorState, StateEffect, type Extension } from "@codemirror/state";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { indentMore, indentLess } from "@codemirror/commands";

import { motion } from "framer-motion";
import { useAtomValue } from "jotai";

import { AppState } from "../state/state";
import { Mode } from "../utils/constants";
import { Toolbar } from "./components/toolbar";
import { AnimateCodeStatusBar } from "./components/animate-code-status-bar";
import { useAdaptiveCursorColor } from "../utils/hooks/use-adaptive-cursor-color";
import {
  BaseThemeColor,
  ThemeNames,
  Themes,
} from "./components/code-editor/extensions/themes";
import { fontSizeExtension } from "./components/code-editor/extensions/fonts";

type Props = {
  ref: RefObject<HTMLDivElement | null>;
  animationKey?: string;
  layoutId?: string;
  value?: string;
  onChange?: (v: string) => void;
  language?: string;
  className?: string;
};

const CodeEditorWithHighlight = ({
  ref,
  animationKey,
  layoutId,
  value = "",
  onChange,
  className = "",
}: Props) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);

  const preRef = useRef<HTMLPreElement | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const mode = useAtomValue(AppState.mode);
  const previewEditorTheme = useAtomValue(AppState.previewEditorTheme);
  const editorTheme = useAtomValue(AppState.editorTheme);
  const previewLanguage = useAtomValue(AppState.previewLanguage);
  const editorFontSize = useAtomValue(AppState.editorConfig.fontSize);

  useAdaptiveCursorColor({ preTagRef: preRef, textareaRef: taRef });

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({ doc: value });

    const view = new EditorView({
      state: state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => view.destroy();
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    if (previewEditorTheme || editorTheme) {
      view.dispatch({
        effects: StateEffect.reconfigure.of(
          createExtensions({
            editorTheme: previewEditorTheme || editorTheme,
            editorFontSize,
            previewLanguage,
            onChangeRef,
          }),
        ),
      });
    }
  }, [previewEditorTheme, editorTheme, editorFontSize, previewLanguage]);

  // 2️⃣ Sync external value -> editor
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const currentValue = view.state.doc.toString();
    if (value !== currentValue) {
      view.contentDOM.focus();

      const transaction = view.state.update({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      });

      view.dispatch(transaction);
    }
  }, [value]);

  // Handle focus in/out for preview mode
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    if (mode === Mode.Preview) {
      view.contentDOM.blur();
    } else {
      view.contentDOM.focus();
    }
  }, [mode]);

  return (
    <motion.div
      key={animationKey}
      className={`relative aspect-video w-full h-auto max-h-full max-w-full ${className} overflow-hidden`}
      layoutId={layoutId}
      ref={ref}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 18,
        mass: 0.6,
      }}
    >
      <div
        className="w-full h-full border-2 border-white rounded-lg flex flex-col overflow-hidden"
        style={{
          backgroundColor:
            BaseThemeColor[previewEditorTheme || editorTheme].background,
          color: BaseThemeColor[previewEditorTheme || editorTheme].foreground,
        }}
      >
        <Toolbar
          enableButtonPlay={false}
          enableButtonPreview
          enableActionButtonPreview
          enableActionButtonClose={false}
          enableActionButtonMinimize={false}
          enableActionButtonResize={false}
        />

        <div
          ref={editorRef}
          id="code-block"
          className="relative flex-1 overflow-auto"
        ></div>

        <AnimateCodeStatusBar />
      </div>
    </motion.div>
  );
};

const tabKeymap = keymap.of([
  {
    key: "Tab",
    run: indentMore,
    preventDefault: true,
  },
  {
    key: "Shift-Tab",
    run: indentLess,
    preventDefault: true,
  },
]);

// TODO:
// 1. auto indent not yet working
function createExtensions({
  editorTheme,
  editorFontSize,
  previewLanguage,
  onChangeRef,
}: {
  editorTheme: ThemeNames;
  editorFontSize: number;
  previewLanguage: string;
  onChangeRef: React.MutableRefObject<((v: string) => void) | undefined>;
}): Extension[] {
  return [
    lineNumbers(),
    highlightActiveLine(),
    loadLanguage(previewLanguage),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const newValue = update.state.doc.toString();
        onChangeRef.current?.(newValue);
      }
    }),
    Themes[editorTheme],
    fontSizeExtension(editorFontSize),
    tabKeymap,
  ].filter(Boolean) as Extension[];
}

export function loadLanguage(lang: string | null): Extension | null {
  switch (lang) {
    case "html":
      return html({});
    case "css":
      return css();
    case "javascript":
      return javascript({});

    default:
      return null;
  }
}

export default memo(CodeEditorWithHighlight);
