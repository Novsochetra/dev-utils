import { useAtomValue } from "jotai";
import { memo, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { v4 } from "uuid";
import DiffMatchPatch from "diff-match-patch";
import { EditorState } from "@codemirror/state";
import { HighlightStyle, syntaxTree } from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { highlightTree } from "@lezer/highlight";

import { AppState } from "../../state/state";
import { Toolbar } from "./toolbar";
import { AnimateCodeStatusBar } from "./animate-code-status-bar";
import { measureFontMetrics } from "../../utils/helpers";

import {
  BaseThemeColor,
  BaseThemeStyle,
} from "./code-editor/extensions/themes";

function getLanguageExtension(lang: string) {
  switch (lang) {
    case "javascript":
    case "js":
    case "jsx":
      return javascript();
    case "html":
      return html();
    case "css":
      return css();
    default:
      return javascript(); // fallback
  }
}

/**
 * === INJECTOR: turn HighlightStyle into CSS classes ===
 */
export function injectHighlightStyleToDOM(
  style: HighlightStyle,
  id = "lezer-gruvbox",
) {
  let el = document.getElementById(id);
  if (el) {
    el.textContent = style.module?.getRules() || "";
  } else {
    el = document.createElement("style");
    el.id = id;
    el.textContent = style.module?.getRules() || "";
    document.head.appendChild(el);
  }
}

function getHighlightClasses(
  text: string,
  language: string,
  highlightStyle2: HighlightStyle,
) {
  const langExt = getLanguageExtension(language);
  const state = EditorState.create({
    doc: text,
    extensions: [langExt],
  });

  const tree = syntaxTree(state);

  // Each char gets its class name
  const classes: string[] = Array.from({ length: text.length }, () => "");

  // Use default CodeMirror highlight style
  highlightTree(tree, highlightStyle2, (from, to, classesStr) => {
    for (let i = from; i < to; i++) {
      classes[i] = classesStr;
    }
  });

  return classes;
}

const dmp = new DiffMatchPatch();

type MultiLineDiffAnimatorProps = {
  oldText: string;
  newText: string;
};

export const AnimateCodeSlide = memo(
  ({ oldText, newText }: MultiLineDiffAnimatorProps) => {
    const previewEditorTheme = useAtomValue(AppState.previewEditorTheme);
    const editorTheme = useAtomValue(AppState.editorTheme);
    const previewSize = useAtomValue(AppState.previewSize);
    const previewLanguage = useAtomValue(AppState.previewLanguage);
    const editorFontSize = useAtomValue(AppState.editorConfig.fontSize);
    const { charWidth, lineHeight } = useMemo(
      () => measureFontMetrics(editorFontSize),
      [editorFontSize],
    );
    const highlightStyle = useMemo(() => {
      return HighlightStyle.define(
        BaseThemeStyle[previewEditorTheme || editorTheme],
      );
    }, [editorTheme, previewEditorTheme]);

    injectHighlightStyleToDOM(highlightStyle);

    const removeDuration = useAtomValue(
      AppState.editorConfig.animationConfig.removeDuration,
    );
    const addDuration = useAtomValue(
      AppState.editorConfig.animationConfig.addDuration,
    );
    const addedDelayPerChar = useAtomValue(
      AppState.editorConfig.animationConfig.addedDelayPerChar,
    );
    const lineDelay = useAtomValue(
      AppState.editorConfig.animationConfig.lineDelay,
    );

    // Compute diff
    const diffs = useMemo(
      () => dmp.diff_main(oldText, newText),
      [oldText, newText],
    );

    const highlightClasses = useMemo(() => {
      if (typeof window === "undefined") return [];
      return getHighlightClasses(newText, previewLanguage, highlightStyle);
    }, [newText, previewLanguage, highlightStyle]);

    // Compute positions for characters
    const computePositions = (text: string) => {
      const positions: { x: number; y: number; line: number; col: number }[] =
        [];
      let x = 0,
        y = 0,
        line = 0,
        col = 0;
      for (let i = 0; i < text.length; i++) {
        positions.push({ x, y, line, col });
        if (text[i] === "\n") {
          x = 0;
          y += lineHeight;
          line++;
          col = 0;
        } else {
          x += charWidth;
          col++;
        }
      }
      return positions;
    };

    const oldPositions = computePositions(oldText);
    const newPositions = computePositions(newText);

    // Build characters array
    const chars: {
      char: string;
      type: number;
      key: string;
      oldX?: number;
      oldY?: number;
      finalX: number;
      finalY: number;
      line: number;
      col: number;
      index: number;
      color?: string;
      classes?: string;
    }[] = [];

    let oldIndex = 0;
    let newIndex = 0;
    let charIndex = 0;

    diffs.forEach(([type, text], diffIndex) => {
      const splitChars = text.split("");
      splitChars.forEach((c) => {
        let oldPos, newPos;
        let charClass = "";

        if (type === 0) {
          oldPos = oldPositions[oldIndex];
          newPos = newPositions[newIndex];
          charClass = highlightClasses[newIndex];
          oldIndex++;
          newIndex++;
        } else if (type === -1) {
          oldPos = oldPositions[oldIndex];
          newPos = { x: 0, y: 0, line: 0, col: 0 };
          oldIndex++;
        } else if (type === 1) {
          charClass = highlightClasses[newIndex];
          oldPos = { x: 0, y: 0, line: 0, col: 0 };
          newPos = newPositions[newIndex];
          newIndex++;
        }

        chars.push({
          char: c,
          type,
          key: `${diffIndex}-${charIndex}`,
          oldX: oldPos?.x,
          oldY: oldPos?.y,
          finalX: newPos?.x ?? 0,
          finalY: newPos?.y ?? 0,
          line: newPos?.line ?? 0,
          col: newPos?.col ?? 0,
          index: charIndex,
          classes: charClass || "",
        });

        charIndex++;
      });
    });

    useEffect(() => {
      return () => {
        const c = document.getElementById("lezer-gruvbox");
        if (c) {
          document.head.removeChild(c);
        }
      };
    }, []);

    return (
      <motion.div
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 18,
          mass: 0.6,
        }}
        key="code-editor-preview"
        className="flex flex-col font-jetbrains-mono rounded-lg relative overflow-hidden select-none border-2 border-white"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          aspectRatio: 16 / 9,
          width: `${previewSize}%`,
          backgroundColor:
            BaseThemeColor[previewEditorTheme || editorTheme].background,
          color: BaseThemeColor[previewEditorTheme || editorTheme].foreground,
        }}
        layoutId="code-editor"
        layoutCrossfade={false}
      >
        <Toolbar />

        <div
          // INFO: ensure the animation across slide has uniq animation key
          // otherwise some character transtion (add, modified, removed)
          // seem not animate correctly
          className="flex-1 overflow-x-auto p-4"
          // key={v4()}
          style={{ position: "relative" }}
        >
          {chars.map((c) => {
            let initial: any, animateProps: any;

            if (c.type === -1) {
              // Removed text: move up and fade out
              initial = {
                x: c.oldX,
                y: c.oldY,
                opacity: 1,
                textDecoration: "line-through",
              };
              animateProps = {
                y: (c.oldY || 0) - 8,
                opacity: 0,
                transition: { duration: removeDuration },
              };
            } else if (c.type === 0) {
              // Changed text: appear after removal
              const delay =
                removeDuration + addedDelayPerChar + c.line * lineDelay;
              initial = { x: c.oldX, y: c.oldY, opacity: 1 }; // maybe slightly faded initially
              animateProps = {
                x: c.finalX,
                y: c.finalY,
                opacity: 1,
                transition: {
                  duration: addDuration,
                  delay,
                },
              };
            } else if (c.type === 1) {
              // Added text: appear after changed text
              const delay =
                removeDuration +
                addDuration +
                addedDelayPerChar +
                c.line * lineDelay;
              initial = {
                x: c.finalX,
                y: c.finalY + 8, // start slightly below
                opacity: 0,
              };
              animateProps = {
                x: c.finalX,
                y: c.finalY,
                opacity: 1,
                color: c.color,
                transition: {
                  duration: addDuration,
                  delay,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                },
              };
            }

            return (
              <motion.span
                key={c.key}
                initial={initial}
                className={`${c.classes}`}
                animate={animateProps}
                style={{
                  fontSize: editorFontSize,
                  position: "absolute",
                  display: "inline-block",
                }}
              >
                {c.char === "\n" ? "" : c.char}
              </motion.span>
            );
          })}
        </div>

        <AnimateCodeStatusBar />
      </motion.div>
    );
  },
);
