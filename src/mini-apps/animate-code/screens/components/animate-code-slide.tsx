import { useAtomValue } from "jotai";
import { memo, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { v4 } from "uuid";
import DiffMatchPatch from "diff-match-patch";
import hljs from "highlight.js";
import { tags as t } from "@lezer/highlight";
import { EditorState } from "@codemirror/state";
import {
  defaultHighlightStyle,
  HighlightStyle,
  syntaxTree,
} from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { highlightTree } from "@lezer/highlight";

import { AppState } from "../../state/state";
import { Toolbar } from "./toolbar";
import { AnimateCodeStatusBar } from "./animate-code-status-bar";
import { useEditorThemes } from "../../utils/hooks/use-editor-themes";
import { measureFontMetrics } from "../../utils/helpers";

import {
  gruvboxDark,
  gruvboxDarkStyle,
} from "./code-editor/extensions/themes/gruvbox";
import { BaseThemeColor } from "./code-editor/extensions/themes";

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
console.log("D: ", { defaultHighlightStyle, gruvboxDarkStyle });

// TODO: adjust the style
const highlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "#fb4934" },
  {
    tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
    color: "#8ec07c",
  },
  { tag: [t.variableName], color: "#83a598" },
  { tag: [t.function(t.variableName)], color: "#b8bb26", fontStyle: "bold" },
  { tag: [t.labelName], color: "#ebdbb2" },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "#d3869b" },
  { tag: [t.definition(t.name), t.separator], color: "#ebdbb2" },
  { tag: [t.brace], color: "#ebdbb2" },
  { tag: [t.annotation], color: "#fb4934d" },
  {
    tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
    color: "#d3869b",
  },
  { tag: [t.typeName, t.className], color: "#fabd2f" },
  { tag: [t.operator, t.operatorKeyword], color: "#fb4934" },
  {
    tag: [t.tagName],
    color: "#8ec07c",
    fontStyle: "bold",
  },
  { tag: [t.squareBracket], color: "#fe8019" },
  { tag: [t.angleBracket], color: "#83a598" },
  { tag: [t.attributeName], color: "#8ec07c" },
  { tag: [t.regexp], color: "#8ec07c" },
  { tag: [t.quote], color: "#928374" },
  { tag: [t.string], color: "#ebdbb2" },
  {
    tag: t.link,
    color: "#a89984",
    textDecoration: "underline",
    textUnderlinePosition: "under",
  },
  { tag: [t.url, t.escape, t.special(t.string)], color: "#d3869b" },
  { tag: [t.meta], color: "#fabd2f" },
  { tag: [t.comment], color: "#928374", fontStyle: "italic" },
  { tag: t.strong, fontWeight: "bold", color: "#fe8019" },
  { tag: t.emphasis, fontStyle: "italic", color: "#b8bb26" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.heading, fontWeight: "bold", color: "#b8bb26" },
  { tag: [t.heading1, t.heading2], fontWeight: "bold", color: "#b8bb26" },
  {
    tag: [t.heading3, t.heading4],
    fontWeight: "bold",
    color: "#fabd2f",
  },
  { tag: [t.heading5, t.heading6], color: "#fabd2f" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#d3869b" },
  { tag: [t.processingInstruction, t.inserted], color: "#83a598" },
  { tag: [t.contentSeparator], color: "#fb4934" },
  { tag: t.invalid, color: "#fe8019", borderBottom: `1px dotted #fb4934d` },
]);

/**
 * === INJECTOR: turn HighlightStyle into CSS classes ===
 */
export function injectHighlightStyleToDOM(
  style: HighlightStyle,
  id = "lezer-gruvbox",
) {
  // Prevent double injection
  if (document.getElementById(id)) return;

  const styleEl = document.createElement("style");
  styleEl.id = id;

  console.log("Style: ", style);

  styleEl.textContent = style.module?.getRules() || "";
  document.head.appendChild(styleEl);
}

function getHighlightClasses(text: string, language: string) {
  const langExt = getLanguageExtension(language);
  const state = EditorState.create({
    doc: text,
    extensions: [langExt, gruvboxDark],
  });

  const tree = syntaxTree(state);

  // Each char gets its class name
  const classes: string[] = Array.from({ length: text.length }, () => "");

  // Use default CodeMirror highlight style
  highlightTree(tree, highlightStyle, (from, to, classesStr) => {
    for (let i = from; i < to; i++) {
      classes[i] = classesStr;
    }
  });

  injectHighlightStyleToDOM(highlightStyle);

  console.log("DONE: ");
  return classes;
}

const dmp = new DiffMatchPatch();

function traverseHighlightByClass(node: Node, parentClass?: string): string[] {
  const classes: string[] = [];

  const walk = (n: Node, inheritedClass?: string) => {
    if (n.nodeType === Node.TEXT_NODE) {
      const cls = inheritedClass || "default";
      classes.push(...Array.from(n.textContent || "").map(() => cls));
    } else if (n.nodeType === Node.ELEMENT_NODE) {
      const el = n as HTMLElement;
      const clsToUse = el.classList[0] || inheritedClass;
      n.childNodes.forEach((child) => walk(child, clsToUse));
    }
  };

  walk(node, parentClass);
  return classes;
}

type MultiLineDiffAnimatorProps = {
  oldText: string;
  newText: string;
};

export const AnimateCodeSlide = memo(
  ({ oldText, newText }: MultiLineDiffAnimatorProps) => {
    useEditorThemes();
    injectHighlightStyleToDOM(highlightStyle);

    const editorTheme = useAtomValue(AppState.editorTheme);
    const previewSize = useAtomValue(AppState.previewSize);
    const previewLanguage = useAtomValue(AppState.previewLanguage);
    const editorFontSize = useAtomValue(AppState.editorConfig.fontSize);
    const { charWidth, lineHeight } = useMemo(
      () => measureFontMetrics(editorFontSize),
      [editorFontSize],
    );

    const removeDuration = 0.8;
    const addDuration = 1;
    const addedDelayPerChar = 0.08;
    const lineDelay = 0.05;

    // Compute diff
    const diffs = useMemo(
      () => dmp.diff_main(oldText, newText),
      [oldText, newText],
    );

    const highlightClasses = useMemo(() => {
      if (typeof window === "undefined") return [];
      return getHighlightClasses(newText, previewLanguage);
    }, [newText, previewLanguage]);
    // console.log("highlightClasses1: ", highlightClasses1);

    const highlightClasses1 = useMemo(() => {
      if (typeof window === "undefined") return [];

      const highlightCode = hljs.highlight(newText, {
        language: previewLanguage,
      });
      // Create temporary container
      const container = document.createElement("pre");
      container.className = "hljs"; // ensures theme colors applied
      container.style.display = "none";
      container.innerHTML = highlightCode.value;

      document.body.appendChild(container);

      const classes = traverseHighlightByClass(container);

      document.body.removeChild(container);

      return classes;
    }, [newText, previewLanguage]);

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
      <div
        className="hljs flex flex-col font-jetbrains-mono rounded-lg relative overflow-hidden select-none border-2 border-white"
        style={{
          width: `${previewSize}%`,
          maxWidth: "100%",
          maxHeight: "100%",
          aspectRatio: "16 / 9",

          backgroundColor: BaseThemeColor[editorTheme].background,
          color: BaseThemeColor[editorTheme].foreground,
        }}
      >
        <Toolbar />

        <motion.div
          // INFO: ensure the animation across slide has uniq animation key
          // otherwise some character transtion (add, modified, removed)
          // seem not animate correctly
          className="flex-1 overflow-x-auto p-4"
          key={v4()}
          style={{ position: "relative" }}
        >
          {chars.map((c) => {
            let initial: any, animateProps: any;

            if (c.type === 0) {
              initial = { x: c.oldX, y: c.oldY, opacity: 1 };
              animateProps = {
                x: c.finalX,
                y: c.finalY,
                opacity: 1,
                transition: { duration: addDuration },
              };
            } else if (c.type === -1) {
              initial = {
                x: c.oldX,
                y: c.oldY,
                opacity: 1,
                textDecoration: "line-through",
              };
              animateProps = {
                opacity: 0,
                transition: { duration: removeDuration },
              };
            } else if (c.type === 1) {
              const delay =
                addDuration + addedDelayPerChar + c.line * lineDelay;
              initial = {
                x: c.finalX,
                y: c.finalY,
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
        </motion.div>

        <AnimateCodeStatusBar />
      </div>
    );
  },
);
