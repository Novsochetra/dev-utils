import { Button } from "@/vendor/shadcn/components/ui/button";
import {
  AnimationInterval,
  interval,
  Mode,
  PreviewState,
} from "../../utils/constants";
import { MonitorOffIcon, MonitorPlayIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/vendor/shadcn/components/ui/tooltip";
import { useContext } from "react";
import { ProjectContext } from "./project-context";
import { useStore } from "../../state/state";

export const PreviewButton = () => {
  const { id: projectId } = useContext(ProjectContext);
  const setMode = useStore((state) => state.setMode);
  const mode = useStore((state) => state.projectDetail[projectId].mode);
  const setPreviewState = useStore((state) => state.setPreviewState);
  const getCurrentSlideIdx = useStore((state) => state.getCurrentSlideIdx);
  const setCurrentSlideIdx = useStore((state) => state.setCurrentSlideIdx);
  const getSlides = useStore((state) => state.getSlides);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (mode === Mode.Edit) {
              setPreviewState(projectId, PreviewState.PLAY);

              interval.previewAnimationInterval = setInterval(() => {
                const currentSlideIdx = getCurrentSlideIdx(projectId);

                const newIdx = currentSlideIdx + 1;

                const slides = getSlides(projectId);

                if (newIdx >= slides.length) {
                  if (interval.previewAnimationInterval) {
                    clearInterval(interval.previewAnimationInterval);
                    interval.previewAnimationInterval = null;
                  }

                  setCurrentSlideIdx(projectId, currentSlideIdx);
                  return;
                }

                setCurrentSlideIdx(projectId, newIdx);
              }, AnimationInterval);
            }

            if (mode === Mode.Edit) {
              setMode(projectId, Mode.Preview);
            } else {
              setMode(projectId, Mode.Edit);
            }
          }}
        >
          {mode === Mode.Edit ? (
            <MonitorPlayIcon size={12} />
          ) : (
            <MonitorOffIcon size={12} />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center">
          <span className="mr-4">Present</span>

          <kbd className="bg-white text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            <span className="text-xs">
              {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}
            </span>
            <span className="text-xs"> + ⏎</span>
          </kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
