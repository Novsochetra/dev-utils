import React, { useState, useMemo, useEffect } from "react";
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

// Traverse HLJS DOM to extract per-character colors
function traverseHighlightDynamic(node: Node, parentColor?: string): string[] {
  let colors: string[] = [];

  if (node.nodeType === Node.TEXT_NODE) {
    const color = parentColor || "#fff";
    colors.push(...Array.from(node.textContent || "").map(() => color));
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    const computed = window.getComputedStyle(el);
    const newColor = computed.color || parentColor; // fallback to parent
    node.childNodes.forEach((child) => {
      colors.push(...traverseHighlightDynamic(child, newColor));
    });
  }

  return colors;
}

type MultiLineDiffAnimatorProps = {
  oldText: string;
  newText: string;
};

export default function MultiLineDiffAnimator({
  oldText,
  newText,
}: MultiLineDiffAnimatorProps) {
  const [bgColor, setBgColor] = useState("white");
  const [animate, setAnimate] = useState(true);

  // Compute diff
  const diffs = useMemo(
    () => dmp.diff_main(oldText, newText),
    [oldText, newText],
  );

  // Compute highlight colors dynamically
  const highlightColors = useMemo(() => {
    if (typeof window === "undefined") return [];

    // Create temporary container
    const container = document.createElement("pre");
    container.className = "hljs"; // ensures theme colors applied
    container.style.display = "none";
    container.innerHTML = hljs.highlightAuto(newText).value;
    document.body.appendChild(container);

    const colors = traverseHighlightDynamic(container);

    document.body.removeChild(container);
    return colors;
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
        color: highlightColors[newIndex - 1],
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
      className="w-full h-full p-4 font-jetbrains-mono min-h-60 rounded-md"
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
        {!animate &&
          oldText.split("").map((c, i) => {
            const pos = oldPositions[i];
            return (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: pos.x,
                  top: pos.y,
                  width: charWidth,
                  display: "inline-block",
                }}
              >
                {c}
              </span>
            );
          })}

        {animate &&
          chars.map((c) => {
            let initial: any, animateProps: any, style: any;

            if (c.type === 0) {
              initial = { x: c.oldX, y: c.oldY, opacity: 1 };
              animateProps = {
                x: c.finalX,
                y: c.finalY,
                opacity: 1,
                transition: { duration: addDuration },
              };
              style = { color: c.color || "#fff" };
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
              style = { textDecoration: "line-through", color: "#f87171" };
            } else if (c.type === 1) {
              const delay =
                addDuration + addedDelayPerChar + c.line * lineDelay;
              initial = { x: c.finalX, y: c.finalY, opacity: 0 };
              animateProps = {
                x: c.finalX,
                y: c.finalY,
                opacity: 1,
                transition: {
                  duration: addDuration,
                  delay,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                },
              };
              style = { color: c.color || "#34d399" };
            }

            return (
              <motion.span
                key={c.key}
                initial={initial}
                animate={animateProps}
                style={{
                  position: "absolute",
                  width: charWidth,
                  display: "inline-block",
                  ...style,
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
