import { type RefObject, useEffect } from "react";
import { useStore } from "../../state/state";

export const useAdaptiveCursorColor = ({
  projectId,
  preTagRef,
  textareaRef,
}: {
  projectId: string;
  preTagRef: RefObject<HTMLPreElement | null>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}) => {
  const editorTheme = useStore(
    (state) => state.projectDetail[projectId].editorTheme,
  );

  useEffect(() => {
    if (preTagRef.current && preTagRef.current && textareaRef.current) {
      const color = getComputedStyle(preTagRef.current).color;
      textareaRef.current.style.caretColor = color;
    }
  }, [preTagRef.current, editorTheme]);
};
