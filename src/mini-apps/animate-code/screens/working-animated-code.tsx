"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import DiffMatchPatch from "diff-match-patch";

const dmp = new DiffMatchPatch();

const charWidth = 8;
const lineHeight = 20;
const removeDuration = 0.8;
const addDuration = 1;
const addedDelayPerChar = 0.08;
const lineDelay = 0.05;

export default function MultiLineDiffAnimator({ oldText, newText }) {
  const [animate, setAnimate] = useState(true);

  const diffs = useMemo(
    () => dmp.diff_main(oldText, newText),
    [oldText, newText],
  );

  const computePositions = (text: string) => {
    const positions: { x: number; y: number; line: number; col: number }[] = [];
    let x = 0;
    let y = 0;
    let line = 0;
    let col = 0;
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

  const chars: {
    char: string;
    type: number; // 0: unchanged, -1: removed, 1: added
    key: string;
    oldX?: number;
    oldY?: number;
    finalX: number;
    finalY: number;
    line: number;
    col: number;
    index: number;
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
      });

      charIndex++;
    });
  });

  // Compute global delay for added characters (wait until all removed/changed finish)
  const maxRemoveChangeDelay = chars
    .filter((c) => c.type === 0 || c.type === -1)
    .reduce((max, c) => {
      const delay = c.type === -1 ? removeDuration : 0; // removed chars take removeDuration
      return Math.max(max, delay);
    }, 0);

  return (
    <div
      style={{
        padding: 20,
        background: "#1e1e1e",
        fontFamily: "monospace",
        color: "white",
        minHeight: 200,
      }}
    >
      <div style={{ position: "relative", minHeight: 200 }}>
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
              // unchanged/moved
              initial = { x: c.oldX, y: c.oldY, opacity: 1 };
              animateProps = {
                x: c.finalX,
                y: c.finalY,
                opacity: 1,
                transition: { duration: addDuration, delay: 0 },
              };
              style = { color: "white" };
            } else if (c.type === -1) {
              // removed
              initial = {
                x: c.oldX,
                y: c.oldY,
                opacity: 1,
                color: "#f87171",
                textDecoration: "line-through",
              };
              animateProps = {
                opacity: 0,
                transition: { duration: removeDuration, delay: 0 },
              };
              style = { color: "#f87171", textDecoration: "line-through" };
            } else if (c.type === 1) {
              // added
              const delay =
                addDuration + addedDelayPerChar + c.line * lineDelay;

              initial = {
                x: c.finalX,
                y: c.finalY,
                opacity: 0,
                color: "#34d399",
              };
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
              style = { color: "#34d399" };
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
      </div>

      <button
        onClick={() => setAnimate(true)}
        style={{
          marginTop: 20,
          padding: "6px 12px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Animate Code
      </button>
    </div>
  );
}
