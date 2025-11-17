import { useContext, useEffect } from "react";
import { useAtomValue } from "jotai";
import { AppState } from "../../state/state";
import { ProjectContext } from "../../screens/components/project-context";

export const useEditorThemes = () => {
  const { id: projectId } = useContext(ProjectContext);
  const editorTheme = useAtomValue(
    AppState.projectDetail[projectId].editorTheme,
  );
  const previewEditorTheme = useAtomValue(
    AppState.projectDetail[projectId].previewEditorTheme,
  );

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
