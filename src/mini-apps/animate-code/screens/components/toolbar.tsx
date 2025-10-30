import { useAtom, useAtomValue } from "jotai";
import { memo } from "react";
import {
  ChevronsLeftRightIcon,
  ChevronsRightLeftIcon,
  Maximize2Icon,
  Minimize2Icon,
  MinusIcon,
  PaletteIcon,
  PauseIcon,
  PlayIcon,
  RotateCcw,
  XIcon,
} from "lucide-react";

import { AppState, slideLengthAtom, store } from "../../state/state";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/vendor/shadcn/components/ui/popover";
import { Input } from "@/vendor/shadcn/components/ui/input";
import { Label } from "@/vendor/shadcn/components/ui/label";
import { Slider } from "@/vendor/shadcn/components/ui/slider";

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
      <GradientButton />

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
      <GradientButton />

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
          className="group w-3 h-3 rounded-full bg-red-500 flex items-center justify-center cursor-pointer transition-colors hover:bg-red-400"
          onClick={() => {
            AppActions.SetMode(Mode.Edit);
            AppActions.SetPreviewSize(100);
          }}
        >
          <XIcon
            className="text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            size={10}
          />
        </div>
        <div className="group w-3 h-3 rounded-full bg-yellow-500 cursor-pointer flex items-center justify-center transition-colors hover:bg-yellow-400">
          <MinusIcon
            className="text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            size={10}
          />
        </div>

        <ButtonMacResizeToolbar />
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

export const ButtonMacResizeToolbar = memo(() => {
  const previewResizeDirection = useAtomValue(AppState.previewResizeDirection);

  return (
    <div
      className="group w-3 h-3 rounded-full bg-green-500 cursor-pointer flex items-center justify-center transition-colors hover:bg-green-400"
      onClick={() => {
        AppActions.TogglePreviewSize();
      }}
    >
      {previewResizeDirection === PreviewResizeDirection.DOWN ? (
        <ChevronsRightLeftIcon
          className="text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          size={10}
        />
      ) : (
        <ChevronsLeftRightIcon
          className="text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          size={10}
        />
      )}
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

export const GradientButton = memo(() => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={adaptiveWrapperStyle}>
          <PaletteIcon size={16} />
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-64">
        <div className="flex flex-col gap-2">
          <GradientFieldAngle />

          <div className="flex flex-1 gap-4">
            <GradientFieldFrom />

            <GradientFieldTo />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});

export const GradientFieldAngle = memo(() => {
  const angle = useAtomValue(AppState.previewBackground.angle);

  return (
    <div>
      <Label className="text-xs mb-2">Angle ({angle}°)</Label>
      <Slider
        value={[angle]}
        max={360}
        min={0}
        step={1}
        onValueChange={(v) => {
          store.set(AppState.previewBackground.angle, Number(v));
        }}
      />
    </div>
  );
});

export const GradientFieldFrom = memo(() => {
  const from = useAtomValue(AppState.previewBackground.from);

  return (
    <div className="flex-1">
      <Label className="text-xs mb-2">From</Label>
      <Input
        type="color"
        value={from}
        onChange={(e) => {
          store.set(AppState.previewBackground.from, e.target.value);
        }}
      />
    </div>
  );
});

export const GradientFieldTo = memo(() => {
  const to = useAtomValue(AppState.previewBackground.to);

  return (
    <div className="flex-1">
      <Label className="text-xs mb-2">To</Label>
      <Input
        type="color"
        value={to}
        onChange={(e) => {
          store.set(AppState.previewBackground.to, e.target.value);
        }}
      />
    </div>
  );
});
