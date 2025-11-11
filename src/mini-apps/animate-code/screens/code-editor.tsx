"use client";
import React, {
  memo,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { EditorView, highlightActiveLine, lineNumbers } from "@codemirror/view";
import { EditorState, StateEffect } from "@codemirror/state";
import { html } from "@codemirror/lang-html";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";

import { AppState } from "../state/state";
import { Mode } from "../utils/constants";
import { Toolbar } from "./components/toolbar";
import { AnimateCodeStatusBar } from "./components/animate-code-status-bar";
import { useEditorThemes } from "../utils/hooks/use-editor-themes";
import { useAdaptiveCursorColor } from "../utils/hooks/use-adaptive-cursor-color";
import { gruvboxDark } from "./components/code-editor/extensions/themes/gruvbox";
import { xcodeLight } from "./components/code-editor/extensions/themes/xcode";
import { Themes } from "./components/code-editor/extensions/themes";

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
  language = "javascript",
  className = "",
}: Props) => {
  // useEditorThemes();

  const editorRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);

  const preRef = useRef<HTMLPreElement | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const mode = useAtomValue(AppState.mode);
  const previewEditorTheme = useAtomValue(AppState.previewEditorTheme);
  const previewLanguage = useAtomValue(AppState.previewLanguage);
  const currentSlideIdx = useAtomValue(AppState.currentSlideIdx);
  const editorFontSize = useAtomValue(AppState.editorConfig.fontSize);

  useAdaptiveCursorColor({ preTagRef: preRef, textareaRef: taRef });

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        html(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newValue = update.state.doc.toString();
            onChangeRef.current?.(newValue);
          }
        }),
        gruvboxDark,
      ],
    });

    const view = new EditorView({
      state: state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => view.destroy();
  }, []);

  // when theme changes -> update extension
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    console.log("previewEditorTheme: ", previewEditorTheme);
    if (previewEditorTheme) {
      view.dispatch({
        // TODO: fix type error
        effects: StateEffect.reconfigure.of([Themes[previewEditorTheme]]),
      });
    }
  }, [previewEditorTheme]);

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
      <div className="w-full h-full hljs border-2 border-white rounded-lg flex flex-col overflow-hidden">
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

export default memo(CodeEditorWithHighlight);
