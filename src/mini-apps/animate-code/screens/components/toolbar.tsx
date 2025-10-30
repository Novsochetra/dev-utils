import { useAtom, useAtomValue } from "jotai";
import { memo } from "react";
import {
  Maximize2Icon,
  Minimize2Icon,
  MinusIcon,
  PauseIcon,
  PlayIcon,
  RotateCcw,
  XIcon,
} from "lucide-react";

import { AppState, slideLengthAtom } from "../../state/state";
import { AppActions } from "../../state/actions";
import {
  Mode,
  PreviewResizeDirection,
  PreviewState,
} from "../../utils/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/vendor/shadcn/components/ui/tooltip";
import { isApplePlatform } from "../../utils/helpers";

export const Toolbar = memo(() => {
  return (
    <div className="flex h-10 w-full absolute top-0 left-0 border-b border-b-black/20">
      {isApplePlatform() ? <LeftMacToolbar /> : <LeftToolbar />}

      <div className="flex flex-1 items-center justify-center px-4">
        <ToolbarTitle />
      </div>

      {isApplePlatform() ? <RightMacToolbar /> : <RightToolbar />}
    </div>
  );
});

export const RightToolbar = memo(() => {
  const previewResizeDirection = useAtomValue(AppState.previewResizeDirection);
  return (
    <div className="flex-1 flex items-center justify-end">
      <ButtonPlayPaused />

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
          <Minimize2Icon size={16} />
        ) : (
          <Maximize2Icon size={16} />
        )}
      </div>
      <ButtonClose />
    </div>
  );
});

const RightMacToolbar = memo(() => {
  const previewResizeDirection = useAtomValue(AppState.previewResizeDirection);

  return (
    <div className="flex items-center gap-2 px-4">
      {/* Play/Pause */}
      <ButtonPlayPaused />

      {/* Minimize / Maximize */}
      <div
        className="p-1 rounded hover:bg-white/20 cursor-pointer"
        onClick={() => AppActions.TogglePreviewSize()}
      >
        {previewResizeDirection === PreviewResizeDirection.DOWN ? (
          <Minimize2Icon size={16} />
        ) : (
          <Maximize2Icon size={16} />
        )}
      </div>
    </div>
  );
});

const adaptiveWrapperStyle = isApplePlatform()
  ? "flex items-center justify-center p-1 rounded hover:bg-white/20 cursor-pointer transition-colors"
  : "flex items-center justify-center hover:bg-black/20 cursor-pointer transition-colors h-full aspect-square";

const ButtonPlayPaused = memo(() => {
  const previewState = useAtomValue(AppState.previewState);

  const renderContent = () => {
    const isPlaying = previewState === PreviewState.PLAY;

    if (isPlaying) {
      return <PauseIcon className="text-white" size={16} />;
    }

    if (previewState === PreviewState.FINISH) {
      return <RotateCcw size={16} />;
    }

    return <PlayIcon size={16} />;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={adaptiveWrapperStyle}
          onClick={() => {
            switch (previewState) {
              case PreviewState.PAUSE:
              case PreviewState.IDLE: {
                AppActions.SetPreviewState(PreviewState.PLAY);
                break;
              }
              case PreviewState.FINISH: {
                AppActions.SetPreviewState(PreviewState.PLAY);
                AppActions.SetPreviewSlideIdx(0);
                break;
              }

              case PreviewState.RESUME:
              case PreviewState.PLAY: {
                AppActions.SetPreviewState(PreviewState.PAUSE);
                break;
              }
              default:
                break;
            }
          }}
        >
          {renderContent()}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center">
          <span className="mr-4">Press</span>

          <kbd className="bg-white text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            <span className="text-xs">Space</span>
          </kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  );
});

export const LeftToolbar = memo(() => {
  const previewSlideIdx = useAtomValue(AppState.previewSlideIdx);
  const totalSlides = useAtomValue(slideLengthAtom);

  return (
    <div className="flex sm:flex-1 gap-4">
      <div className="flex">
        <img
          src="./assets/icons/android-chrome-192x192.png "
          className="w-4 h-4 self-center ml-4 rounded-xs"
        />
      </div>

      <div className="items-center hidden sm:flex">
        <p className="text-sm font-bold">
          {(previewSlideIdx || 0) + 1} / {totalSlides}
        </p>
      </div>
    </div>
  );
});

const LeftMacToolbar = memo(() => {
  const previewSlideIdx = useAtomValue(AppState.previewSlideIdx);
  const totalSlides = useAtomValue(slideLengthAtom);

  return (
    <div className="flex items-center gap-2 pl-4 shrink">
      {/* Traffic lights */}
      <div className="flex gap-2">
        <div
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer"
          onClick={() => {
            AppActions.SetMode(Mode.Edit);
            AppActions.SetPreviewSize(100);
          }}
        />
        <div className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 cursor-pointer" />
        <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer" />
      </div>

      {/* Optional app icon */}
      <img
        src="./assets/icons/android-chrome-192x192.png"
        className="w-4 h-4 rounded-xs ml-4"
      />

      {/* Slide counter */}
      <span className="hidden sm:text-sm font-medium">
        {(previewSlideIdx || 0) + 1} / {totalSlides}
      </span>
    </div>
  );
});

export const ToolbarTitle = memo(() => {
  const [title, setTitle] = useAtom(AppState.previewTitle);

  return (
    <input
      type="text"
      value={title}
      className="outline-none focus-visible:outline-none w-full overflow-scroll text-center font-extrabold truncate"
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
          <XIcon size={16} />
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
