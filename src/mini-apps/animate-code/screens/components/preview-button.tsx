import { useAtom, useSetAtom } from "jotai";
import { AppState, store } from "../../state/state";
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

export const PreviewButton = () => {
  const { id: projectId } = useContext(ProjectContext);
  const [mode, setMode] = useAtom(AppState.projectDetail[projectId].mode);
  const setPreviewState = useSetAtom(
    AppState.projectDetail[projectId].previewState,
  );
  const setCurrentSlideIdx = useSetAtom(
    AppState.projectDetail[projectId].currentSlideIdx,
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (mode === Mode.Edit) {
              setPreviewState(PreviewState.PLAY);

              interval.previewAnimationInterval = setInterval(() => {
                setCurrentSlideIdx((prev) => {
                  const newIdx = prev + 1;

                  const slides = store.get(
                    AppState.projectDetail[projectId].slides,
                  );

                  if (newIdx >= slides.length) {
                    if (interval.previewAnimationInterval) {
                      clearInterval(interval.previewAnimationInterval);
                      interval.previewAnimationInterval = null;
                    }

                    return prev;
                  }

                  return newIdx;
                });
              }, AnimationInterval);
            }

            setMode((prev) => {
              if (prev === Mode.Edit) {
                return Mode.Preview;
              }

              return Mode.Edit;
            });
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
