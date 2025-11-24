import { Link } from "react-router";
import { memo, useRef, useEffect } from "react";
import CodeEditor from "../code-editor";
import { Trash2Icon } from "lucide-react";

import { ProjectContextProvider } from "./project-context";
import { useStore } from "../../state/state";
import { GradientBackground } from "./gradient-background";
import { Button } from "@/vendor/shadcn/components/ui/button";

type ProjectCardProps = {
  id: string;
  index: number;
};

export const ProjectCard = memo(({ id, index }: ProjectCardProps) => {
  const codeEditorRef = useRef<HTMLDivElement | null>(null);
  const removeProject = useStore((state) => state.removeProject);

  return (
    <ProjectContextProvider id={id}>
      <div className="flex flex-col h-full items-center overflow-hidden relative group">
        <Link
          to={`/animate-code/project/${id}`}
          className="w-full aspect-video bg-gray-100 rounded-sm overflow-hidden mb-4"
        >
          <Preview projectId={id}>
            <CodeEditor
              ref={codeEditorRef}
              value="welcome"
              className="rounded-[44px]"
              readonly
            />
          </Preview>
          <Button
            variant="link"
            size="icon"
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-white bg-zinc-600 transition-opacity hover:bg-none z-50"
            onClick={(e) => {
              e.preventDefault();
              removeProject(index);
            }}
          >
            <Trash2Icon size={12} />
          </Button>
        </Link>
        <div className="flex flex-1 h-full">
          <ProjectNameInput index={index} />
        </div>
      </div>
    </ProjectContextProvider>
  );
});

const ProjectNameInput = memo(({ index }: { index: number }) => {
  const setProjectName = useStore((state) => state.setProjectName);
  const name = useStore((state) => state.projects[index]?.name);

  return (
    <input
      type="text"
      name="editor-title-input"
      value={name}
      className="outline-none focus-visible:outline-none w-full overflow-scroll text-center font-extrabold truncate text-ellipsis line-clamp-1"
      onChange={(e) => setProjectName(index, e.target.value)}
    />
  );
});

export function Preview({
  children,
  projectId,
}: {
  projectId: string;
  children: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function resize() {
      if (!wrapperRef.current || !contentRef.current) return;

      const parentW = wrapperRef.current.clientWidth;
      const parentH = wrapperRef.current.clientHeight;

      const baseW = 1920;
      const baseH = 1080;

      const scale = Math.min(parentW / baseW, parentH / baseH);

      contentRef.current.style.transform = `scale(${scale})`;

      // Also center it (important!)
      contentRef.current.style.left = `${(parentW - baseW * scale) / 2}px`;
      contentRef.current.style.top = `${(parentH - baseH * scale) / 2}px`;
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-full overflow-hidden pointer-events-none"
    >
      <GradientBackground projectId={projectId} />
      <div
        ref={contentRef}
        className="absolute p-4 border-red-800"
        style={{
          width: 1920,
          height: 1080,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
