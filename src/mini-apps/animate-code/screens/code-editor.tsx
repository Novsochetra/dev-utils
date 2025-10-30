"use client";
import React, {
  memo,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import hljs from "highlight.js/lib/core";
import("highlight.js/lib/common");
import { motion } from "framer-motion";
import "highlight.js/styles/atom-one-dark.css";
import { useAtomValue } from "jotai";
import { AppState } from "../state/state";
import { Mode } from "../utils/constants";
import { Toolbar } from "./components/toolbar";
import { AnimateCodeStatusBar } from "./components/animate-code-status-bar";
import { Background } from "./components/preview";

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
  const [code, setCode] = useState(value);
  const [highlighted, setHighlighted] = useState("");
  const preRef = useRef<HTMLPreElement | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const mode = useAtomValue(AppState.mode);

  useEffect(() => setCode(value), [value]);

  useEffect(() => {
    if (mode === Mode.Preview) {
      taRef.current?.blur();
    } else {
      taRef.current?.focus();
    }
  }, [mode]);

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
      <div className="w-full h-full hljs border-2 border-red-500 rounded-lg flex flex-col overflow-hidden">
        <div className="w-full h-10">
          <Toolbar
            enableButtonPlay={false}
            enableButtonPreview
            enableActionButtonPreview
            enableActionButtonClose={false}
            enableActionButtonMinimize={false}
            enableActionButtonResize={false}
          />
        </div>

        <div id="code-block" className="relative flex-1 overflow-auto">
          <pre
            ref={preRef}
            aria-hidden="true"
            className="absolute inset-0 font-mono hljs p-3 overflow-auto text-green-500"
            style={{
              fontSize: 12,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
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
            className="absolute inset-0 text-transparent bg-transparent caret-white focus-visible:outline-none focus-visible:ring-0 whitespace-pre-wrap overflow-auto resize-none p-3 font-mono"
            style={{
              fontSize: 12,
            }}
          ></textarea>
        </div>
        <div className="w-full h-8">
          <AnimateCodeStatusBar />
        </div>
      </div>
    </motion.div>
  );
};

export default memo(CodeEditorWithHighlight);

function escapeHtml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
