"use client";
import React, { useEffect, useRef, useState, type Ref } from "react";
import hljs from "highlight.js/lib/core";
import("highlight.js/lib/common");
import { motion } from "framer-motion";
import "highlight.js/styles/atom-one-dark.css";

type Props = {
  ref: Ref<HTMLDivElement | null>;
  animationKey?: string;
  layoutId?: string;
  value?: string;
  onChange?: (v: string) => void;
  language?: string;
  className?: string;
};

export default function CodeEditorWithHighlight({
  ref,
  animationKey,
  layoutId,
  value = "",
  onChange,
  language = "javascript",
  className = "",
}: Props) {
  const [code, setCode] = useState(value);
  const [highlighted, setHighlighted] = useState("");
  const preRef = useRef<HTMLPreElement | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => setCode(value), [value]);

  useEffect(() => {
    try {
      const result = hljs.highlight(code || "", { language });
      setHighlighted(result.value);
    } catch {
      setHighlighted(escapeHtml(code));
    }
  }, [code, language]);

  const onScroll = () => {
    if (!taRef.current || !preRef.current) return;
    preRef.current.scrollTop = taRef.current.scrollTop;
    preRef.current.scrollLeft = taRef.current.scrollLeft;
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = taRef.current!;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newVal = code.slice(0, start) + "\t" + code.slice(end);
      setCode(newVal);
      onChange?.(newVal);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 1;
      });
    }
  };

  return (
    <motion.div
      key={animationKey}
      className={`relative w-full aspect-video ${className}`}
      layoutId={layoutId}
      ref={ref}
    >
      {/* Highlighted code background */}
      <pre
        ref={preRef}
        aria-hidden="true"
        className="absolute inset-0 text-base font-mono hljs border-2 border-red-500 rounded-lg p-3 overflow-auto"
        style={{
          fontSize: 12,
          whiteSpace: "pre-wrap", // ✅ allows long lines to wrap
          wordBreak: "break-word", // ✅ break very long tokens
        }}
      >
        <code dangerouslySetInnerHTML={{ __html: highlighted || " " }} />
      </pre>

      {/* Editable overlay */}
      <textarea
        ref={taRef as any}
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          onChange?.(e.target.value);
        }}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoFocus
        className="absolute inset-0 text-transparent bg-transparent caret-white text-base p-3 rounded-lg 
               focus-visible:outline-none focus-visible:ring-0 whitespace-pre-wrap overflow-auto resize-none font-mono mt-[2px] ml-[2px]"
        style={{
          fontSize: 12,
        }}
      />
    </motion.div>
  );
}

function escapeHtml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
