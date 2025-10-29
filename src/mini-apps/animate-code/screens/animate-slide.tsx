import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { v4 } from "uuid";
import DiffMatchPatch from "diff-match-patch";
import hljs from "highlight.js/lib/core";
import("highlight.js/lib/common");
import "highlight.js/styles/atom-one-dark.css"; // any theme

const dmp = new DiffMatchPatch();

const charWidth = 10;
const lineHeight = 20;
const removeDuration = 0.8;
const addDuration = 1;
const addedDelayPerChar = 0.08;
const lineDelay = 0.05;

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

const unsupportedLanguages = ["perl", "ini", "vbnet", "wasm"];

export default function MultiLineDiffAnimator({
  oldText,
  newText,
}: MultiLineDiffAnimatorProps) {
  const [bgColor, setBgColor] = useState("white");
  const supportLanguages = useMemo(
    () => hljs.listLanguages().filter((l) => !unsupportedLanguages.includes(l)),
    [],
  );

  // Compute diff
  const diffs = useMemo(
    () => dmp.diff_main(oldText, newText),
    [oldText, newText],
  );

  const highlightClasses = useMemo(() => {
    if (typeof window === "undefined") return [];

    const highlightCode = hljs.highlightAuto(newText, supportLanguages);
    // Create temporary container
    const container = document.createElement("pre");
    container.className = "hljs"; // ensures theme colors applied
    container.style.display = "none";
    container.innerHTML = highlightCode.value;

    document.body.appendChild(container);

    const classes = traverseHighlightByClass(container);

    document.body.removeChild(container);
    return classes;
  }, [newText]);

  // Compute positions for characters
  const computePositions = (text: string) => {
    const positions: { x: number; y: number; line: number; col: number }[] = [];
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

      if (type === 0) {
        oldPos = oldPositions[oldIndex];
        newPos = newPositions[newIndex];
        oldIndex++;
        newIndex++;
      } else if (type === -1) {
        oldPos = oldPositions[oldIndex];
        newPos = { x: 0, y: 0, line: 0, col: 0 };
        oldIndex++;
      } else if (type === 1) {
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
        classes: highlightClasses[charIndex],
      });

      charIndex++;
    });
  });

  // Get background color from theme
  useEffect(() => {
    if (typeof window === "undefined") return;
    const temp = document.createElement("pre");
    temp.className = "hljs";
    temp.style.display = "none";
    document.body.appendChild(temp);
    const computed = window.getComputedStyle(temp);
    setBgColor(computed.backgroundColor || "#1e1e1e");
    document.body.removeChild(temp);
  }, []);

  return (
    <div
      className="w-full hljs h-full p-4 font-jetbrains-mono min-h-60 rounded-md"
      style={{
        backgroundColor: bgColor,
      }}
    >
      <motion.div
        // INFO: ensure the animation across slide has uniq animation key
        // otherwise some character transtion (add, modified, removed)
        // seem not animate correctly
        key={v4()}
        style={{ position: "relative", minHeight: 200 }}
      >
        {chars.map((c, i) => {
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
            const delay = addDuration + addedDelayPerChar + c.line * lineDelay;
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
                position: "absolute",
                width: charWidth,
                display: "inline-block",
              }}
            >
              {c.char === "\n" ? "" : c.char}
            </motion.span>
          );
        })}
      </motion.div>
    </div>
  );
}
