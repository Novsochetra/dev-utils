import { memo, useRef, useContext } from "react";

import { ProjectContext } from "../project-context";
import { Preview } from "../project-card";
import CodeEditor from "../../code-editor";
import { useStore } from "@/mini-apps/animate-code/state/state";

export const SliderPreviewImage = memo(({ index }: { index: number }) => {
  const { id: projectId } = useContext(ProjectContext);
  const codeEditorRef = useRef<HTMLDivElement | null>(null);
  const value = useStore(
    (state) => state.projectDetail[projectId].slides[index].data,
  );

  return (
    <div className="aspect-video font-mono overflow-auto text-green-500">
      <Preview projectId={projectId}>
        <CodeEditor
          ref={codeEditorRef}
          value={value}
          className="rounded-[44px]"
          readonly
        />
      </Preview>
    </div>
  );
});
