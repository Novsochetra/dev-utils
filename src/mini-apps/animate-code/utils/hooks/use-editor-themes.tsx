import { useContext, useEffect } from "react";
import { ProjectContext } from "../../screens/components/project-context";
import { useStore } from "../../state/state";

export const useEditorThemes = () => {
  const { id: projectId } = useContext(ProjectContext);
  const editorTheme = useStore(
    (state) => state.projectDetail[projectId].editorTheme,
  );
  const previewEditorTheme = useStore(
    (state) => state.projectDetail[projectId].previewEditorTheme,
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
