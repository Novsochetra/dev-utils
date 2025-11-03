import { useAtom, useAtomValue } from "jotai";
import { createContext, memo, useContext } from "react";
import {
  ChevronsLeftRightIcon,
  ChevronsRightLeftIcon,
  EyeIcon,
  Maximize2Icon,
  Minimize2Icon,
  MinusIcon,
  PaletteIcon,
  PauseIcon,
  PlayIcon,
  RotateCcw,
  XIcon,
} from "lucide-react";

import { AppState, store } from "../../state/state";
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

type ToolbarProps = {
  enableButtonClose?: boolean | undefined;
  enableButtonPlay?: boolean | undefined;
  enableButtonMinimize?: boolean | undefined;
  enableButtonResize?: boolean | undefined;
  enableButtonChangeBackground?: boolean | undefined;
  enableButtonPreview?: boolean | undefined;

  enableActionButtonClose?: boolean | undefined;
  enableActionButtonPlay?: boolean | undefined;
  enableActionButtonMinimize?: boolean | undefined;
  enableActionButtonResize?: boolean | undefined;
  enableActionButtonChangeBackground?: boolean | undefined;
  enableActionButtonPreview?: boolean | undefined;
};

const ToolbarContext = createContext<ToolbarProps>({
  enableButtonClose: true,
  enableButtonPlay: true,
  enableButtonMinimize: true,
  enableButtonResize: true,
  enableButtonChangeBackground: true,
  enableButtonPreview: false,

  enableActionButtonClose: true,
  enableActionButtonPlay: true,
  enableActionButtonMinimize: true,
  enableActionButtonResize: true,
  enableActionButtonChangeBackground: true,
  enableActionButtonPreview: false,
});

export const Toolbar = memo(
  ({
    enableButtonClose = true,
    enableButtonPlay = true,
    enableButtonMinimize = true,
    enableButtonResize = true,
    enableButtonChangeBackground = true,
    enableButtonPreview = false,

    enableActionButtonClose = true,
    enableActionButtonPlay = true,
    enableActionButtonMinimize = true,
    enableActionButtonResize = true,
    enableActionButtonChangeBackground = true,
    enableActionButtonPreview = false,
  }: ToolbarProps) => {
    return (
      <ToolbarContext.Provider
        value={{
          enableButtonClose,
          enableButtonPlay,
          enableButtonMinimize,
          enableButtonResize,
          enableButtonChangeBackground,
          enableButtonPreview,
          enableActionButtonClose,
          enableActionButtonPlay,
          enableActionButtonMinimize,
          enableActionButtonResize,
          enableActionButtonChangeBackground,
          enableActionButtonPreview,
        }}
      >
        <div className="flex h-10 w-full border-b border-b-black/20">
          {isApplePlatform() ? <LeftMacToolbar /> : <LeftToolbar />}

          <div className="flex flex-1 items-center justify-center px-4 shrink-0 box-border">
            <ToolbarTitle />
          </div>

          {isApplePlatform() ? <RightMacToolbar /> : <RightToolbar />}
        </div>
      </ToolbarContext.Provider>
    );
  },
);

export const RightToolbar = memo(() => {
  const { enableButtonMinimize, enableButtonResize } =
    useContext(ToolbarContext);
  const previewResizeDirection = useAtomValue(AppState.previewResizeDirection);

  return (
    <div className="flex flex-1 items-center justify-end">
      {enableButtonMinimize ? (
        <div className="h-full aspect-square flex items-center justify-center hover:bg-black/20 transition-colors">
          <MinusIcon size={16} />
        </div>
      ) : null}

      {enableButtonResize ? (
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
      ) : null}

      <ButtonClose />
    </div>
  );
});

const RightMacToolbar = memo(() => {
  const {
    enableButtonChangeBackground,
    enableButtonPlay,
    enableButtonPreview,
  } = useContext(ToolbarContext);

  return (
    <div className="flex flex-1 items-center justify-end gap-2 pr-2 box-border">
      {enableButtonPreview ? <ButtonPreview /> : null}

      {enableButtonChangeBackground ? <GradientButton /> : null}

      {/* Play/Pause */}
      {enableButtonPlay ? <ButtonPlayPaused /> : null}
    </div>
  );
});

const adaptiveWrapperStyle = isApplePlatform()
  ? "flex items-center justify-center p-1 rounded hover:bg-white/20 cursor-pointer transition-colors"
  : "flex items-center justify-center hover:bg-black/20 cursor-pointer transition-colors h-full aspect-square";

export const ButtonPreview = () => {
  const { enableActionButtonPreview } = useContext(ToolbarContext);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={adaptiveWrapperStyle}
          onClick={() => {
            if (!enableActionButtonPreview) {
              return;
            }

            AppActions.SetMode(Mode.Preview);
          }}
        >
          <EyeIcon size={16} />
        </div>
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

const ButtonPlayPaused = memo(() => {
  const { enableActionButtonPlay } = useContext(ToolbarContext);
  const previewState = useAtomValue(AppState.previewState);

  const renderContent = () => {
    const isPlaying = previewState === PreviewState.PLAY;

    if (isPlaying) {
      return <PauseIcon size={16} />;
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
            if (!enableActionButtonPlay) {
              return;
            }

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
  const {
    enableButtonPlay,
    enableButtonPreview,
    enableButtonChangeBackground,
  } = useContext(ToolbarContext);

  return (
    <div className="flex flex-1">
      <div className="h-full aspect-square flex items-center justify-center">
        <img
          src="./assets/icons/android-chrome-192x192.png "
          className="w-4 h-4 rounded-xs"
        />
      </div>

      {enableButtonPreview ? <ButtonPreview /> : null}

      {enableButtonChangeBackground ? <GradientButton /> : null}

      {enableButtonPlay ? <ButtonPlayPaused /> : null}
    </div>
  );
});

const LeftMacToolbar = memo(() => {
  const {
    enableButtonResize,
    enableButtonMinimize,
    enableButtonClose,
    enableActionButtonClose,
  } = useContext(ToolbarContext);

  return (
    <div className="flex flex-1 items-center gap-2 shrink overflow-hidden pl-2 box-border">
      {/* Traffic lights */}
      <div className="flex gap-2">
        {enableButtonClose ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="group w-3 h-3 rounded-full bg-red-500 flex items-center justify-center cursor-pointer transition-colors hover:bg-red-400"
                onClick={() => {
                  if (!enableActionButtonClose) return;

                  AppActions.SetMode(Mode.Edit);
                  AppActions.SetPreviewSize(100);
                }}
              >
                <XIcon
                  className="text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  size={10}
                />
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
        ) : null}
        {enableButtonMinimize ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="group w-3 h-3 rounded-full bg-yellow-500 cursor-pointer flex items-center justify-center transition-colors hover:bg-yellow-400">
                <MinusIcon
                  className="text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  size={10}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex items-center">
                <span className="mr-4">Minimize ( View Only 😅 )</span>
              </div>
            </TooltipContent>
          </Tooltip>
        ) : null}

        {enableButtonResize ? <ButtonMacResizeToolbar /> : null}
      </div>

      <div className="h-full aspect-square hidden sm:flex items-center justify-center">
        <img
          src="./assets/icons/android-chrome-192x192.png"
          className="w-2 h-2 sm:w-4 sm:h-4 rounded-xs"
        />
      </div>
    </div>
  );
});

export const ButtonMacResizeToolbar = memo(() => {
  const { enableActionButtonResize } = useContext(ToolbarContext);
  const previewResizeDirection = useAtomValue(AppState.previewResizeDirection);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="group w-3 h-3 rounded-full bg-green-500 cursor-pointer flex items-center justify-center transition-colors hover:bg-green-400"
          onClick={() => {
            if (!enableActionButtonResize) return;

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
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center">
          <span className="mr-4">
            Resize{" "}
            {PreviewResizeDirection.DOWN === previewResizeDirection
              ? "Down"
              : "Up"}
          </span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
});

export const ToolbarTitle = memo(() => {
  const [title, setTitle] = useAtom(AppState.previewTitle);

  return (
    <input
      type="text"
      name="editor-title-input"
      value={title}
      className="outline-none focus-visible:outline-none w-full overflow-scroll text-center font-extrabold truncate text-ellipsis line-clamp-1"
      onChange={(e) => setTitle(e.target.value)}
    />
  );
});

const ButtonClose = () => {
  const { enableActionButtonClose } = useContext(ToolbarContext);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="h-full aspect-square flex items-center justify-center hover:bg-black/20 transition-colors"
          onClick={() => {
            if (!enableActionButtonClose) return;

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
