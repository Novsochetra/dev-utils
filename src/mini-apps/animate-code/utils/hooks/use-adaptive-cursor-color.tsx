import { useAtomValue } from "jotai";
import { type RefObject, useEffect } from "react";

import { AppState } from "../../state/state";

export const useAdaptiveCursorColor = ({
  preTagRef,
  textareaRef,
}: {
  preTagRef: RefObject<HTMLPreElement | null>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}) => {
  const editorTheme = useAtomValue(AppState.editorTheme);

  useEffect(() => {
    if (preTagRef.current && preTagRef.current && textareaRef.current) {
      const color = getComputedStyle(preTagRef.current).color;
      textareaRef.current.style.caretColor = color;
    }
  }, [preTagRef.current, editorTheme]);
};
