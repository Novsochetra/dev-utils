import { useAtom, useAtomValue } from "jotai";
import { memo } from "react";
import { Maximize2Icon, Minimize2Icon, MinusIcon, XIcon } from "lucide-react";

import { AppState, slideLengthAtom } from "../../state/state";
import { AppActions } from "../../state/actions";
import { Mode, PreviewResizeDirection } from "../../utils/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/vendor/shadcn/components/ui/tooltip";

export const Toolbar = memo(() => {
  const previewResizeDirection = useAtomValue(AppState.previewResizeDirection);

  return (
    <div className="flex h-10 w-full absolute top-0 left-0 border-b border-b-black/20">
      <LeftToolbar />
      <div className="flex flex-1 items-center justify-center">
        <ToolbarTitle />
      </div>
      <div className="flex-1 flex items-center justify-end">
        <div className="h-full aspect-square flex items-center justify-center hover:bg-black/20 transition-colors">
          <MinusIcon className="text-white" size={16} />
        </div>
        <div
          className="h-full aspect-square flex items-center justify-center hover:bg-black/20 transition-colors"
          onClick={() => {
            AppActions.TogglePreviewSize();
          }}
        >
          {previewResizeDirection === PreviewResizeDirection.DOWN ? (
            <Minimize2Icon className="text-white" size={16} />
          ) : (
            <Maximize2Icon className="text-white" size={16} />
          )}
        </div>
        <ButtonClose />
      </div>
    </div>
  );
});

export const LeftToolbar = () => {
  const currentSlideIdx = useAtomValue(AppState.currentSlideIdx);
  const totalSlides = useAtomValue(slideLengthAtom);

  return (
    <div className="flex flex-1 gap-4">
      <div className="flex">
        <img
          src="./assets/icons/android-chrome-192x192.png "
          className="w-4 h-4 self-center ml-4 rounded-xs"
        />
      </div>

      <div className="flex items-center">
        <p className="text-sm font-bold">
          {currentSlideIdx + 1} / {totalSlides}
        </p>
      </div>
    </div>
  );
};

export const ToolbarTitle = memo(() => {
  const [title, setTitle] = useAtom(AppState.previewTitle);

  return (
    <input
      type="text"
      value={title}
      className="outline-none focus-visible:outline-none w-full overflow-scroll text-center font-extrabold"
      onChange={(e) => setTitle(e.target.value)}
    />
  );
});

const ButtonClose = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="h-full aspect-square flex items-center justify-center hover:bg-black/20 transition-colors"
          onClick={() => {
            AppActions.SetMode(Mode.Edit);
            AppActions.SetPreviewSize(100);
          }}
        >
          <XIcon className="text-white" size={16} />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center">
          <span className="mr-4">Exit</span>

          <kbd className="bg-white text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            <span className="text-xs">Esc</span>
          </kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
