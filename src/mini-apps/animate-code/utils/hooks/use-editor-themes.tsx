import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { AppState } from "../../state/state";

export const useEditorThemes = () => {
  const editorTheme = useAtomValue(AppState.editorTheme);
  const previewEditorTheme = useAtomValue(AppState.previewEditorTheme);

  useEffect(() => {
    const linkId = "animate-code-editor-theme";
    let link = document.getElementById(linkId) as HTMLLinkElement | null;

    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    link.href = `/animate-code/editor/themes/${previewEditorTheme || editorTheme}.min.css`;
  }, [editorTheme, previewEditorTheme]);
};
