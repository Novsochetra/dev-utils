"use client";

import React, { useEffect, useState } from "react";
import hljs from "highlight.js";
import { motion } from "framer-motion";
import { diffLines } from "diff";

interface AnimateCodeProps {
  code: string;
  language?: string;
  lineDelay?: number;
  prevCode?: string; // Pass previous code from parent
}

export const AnimateCode: React.FC<AnimateCodeProps> = ({
  code,
  language = "javascript",
  lineDelay = 0.05,
  prevCode = "",
}) => {
  const [highlightedHTML, setHighlightedHTML] = useState<string>("");

  // Highlight current code
  useEffect(() => {
    const result = hljs.highlight(code, { language }).value;
    setHighlightedHTML(result);
  }, [code, language]);

  const lines = highlightedHTML.split("\n");

  // Compute which lines changed
  const lineStates: ("added" | "changed" | "unchanged")[] = [];
  const diffs = diffLines(prevCode, code);

  let lineIdx = 0;
  diffs.forEach((part) => {
    const partLines = part.value.split("\n");
    if (partLines[partLines.length - 1] === "") partLines.pop();

    partLines.forEach(() => {
      if (part.added) lineStates[lineIdx] = "added";
      else if (part.removed) lineStates[lineIdx] = "changed";
      else lineStates[lineIdx] = "unchanged";
      lineIdx += 1;
    });
  });

  return (
    <motion.div
      className={`hljs ${language} min-h-32`}
      style={{ padding: "1rem", overflowX: "auto" }}
    >
      {lines.map((line, idx) => {
        const state = lineStates[idx] || "unchanged";

        let initial = undefined;
        const animate = { opacity: 1, y: 0 };

        if (state === "added") initial = { opacity: 0, y: 10 };
        else if (state === "changed") initial = { opacity: 0.5, y: 0 };

        return (
          <motion.div
            key={`line-${idx}-${line}`}
            initial={initial}
            animate={animate}
            transition={{
              delay: state !== "unchanged" ? idx * lineDelay : 0,
              type: "spring",
              stiffness: 120,
            }}
            style={{ whiteSpace: "pre", display: "block" }}
            dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }}
          />
        );
      })}
    </motion.div>
  );
};
