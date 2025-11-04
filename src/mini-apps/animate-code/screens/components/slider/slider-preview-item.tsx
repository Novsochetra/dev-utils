import { memo, useState, useRef, useMemo, useEffect } from "react";
import hljs from "highlight.js";
import { useAtomValue } from "jotai";

import { AppState, fallbackAtom } from "@/mini-apps/animate-code/state/state";
import { BORDER_WIDTH, SLIDER_CONTENT_WIDTH } from "./constants";

export const SliderPreviewImage = memo(({ index }: { index: number }) => {
  const slides = useAtomValue(AppState.slides);
  const slideData = useAtomValue(slides[index]?.data || fallbackAtom);
  const previewLanguage = useAtomValue(AppState.previewLanguage);
  const [editorWidth, setEditorWidth] = useState<number | null>(null);
  let timeout = useRef<NodeJS.Timeout | null>(null);
  const editorFontSize = useAtomValue(AppState.editorConfig.fontSize);

  const highlighted = useMemo(() => {
    return (
      hljs.highlight(slideData || "", {
        language: previewLanguage,
      })?.value || ""
    );
  }, [slideData, previewLanguage]);

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    // INFO: delete a bit so the layout animation of code editor can be finish
    setTimeout(() => {
      const el = document.getElementById("code-block");
      if (el) {
        const editorWidth = el.clientWidth - 24;
        setEditorWidth(editorWidth);
      }
    }, 500);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  if (!editorWidth) {
    return null;
  }

  const previewWidth = SLIDER_CONTENT_WIDTH - BORDER_WIDTH * 2;
  const scaleFactor = previewWidth / editorWidth;
  const previewFontSize = editorFontSize * scaleFactor;

  return (
    <pre
      aria-hidden="true"
      className="aspect-video font-mono hljs overflow-auto text-green-500"
      style={{
        boxSizing: "border-box",
        padding: 4,
        width: previewWidth,
        fontSize: previewFontSize,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      <code dangerouslySetInnerHTML={{ __html: highlighted || " " }} />
    </pre>
  );
});
