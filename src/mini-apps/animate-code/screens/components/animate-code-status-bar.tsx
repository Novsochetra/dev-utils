import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/vendor/shadcn/components/ui/command";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useHotkeys } from "react-hotkeys-hook";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";

import { AppState } from "../../state/state";
import { Separator } from "@/vendor/shadcn/components/ui/separator";
import {
  codeEditorConfig,
  Mode,
  supportedHighlightJsLanguages,
  supportedHighlightJsThemes,
} from "../../utils/constants";
import { isApplePlatform } from "../../utils/helpers";
import { AppActions } from "../../state/actions";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/vendor/shadcn/components/ui/tooltip";
import { ProjectContext } from "./project-context";

const languages = supportedHighlightJsLanguages?.map((v) => ({
  label: v.label,
  value: v.value,
}));

const adaptiveStyle = isApplePlatform()
  ? "p-1 hover:bg-white/20 rounded transition-colors cursor-pointer"
  : "flex items-center justify-center hover:bg-black/20 cursor-pointer transition-colors h-full p-1";

export const AnimateCodeStatusBar = React.memo(() => {
  return (
    <div className="max-h-8 flex flex-1 px-2 border-t border-t-black/20 gap-4 overflow-hidden">
      <LeftStatusBar />

      <div className="flex flex-1 min-w-0 gap-2 justify-end items-center">
        <FontSizeGroup />
        <div className="h-4 w-[1px] bg-border" />
        <ChangeThemeStatusBarItem />
        <div className="h-4 w-[1px] bg-border" />
        <ChangeLanguangeStatusBarItem />
      </div>
    </div>
  );
});

export const FontSizeGroup = React.memo(() => {
  return (
    <div className="flex min-w-0 h-full items-center">
      <DecrementFontSizeButton />
      <FontSizeInfo />
      <IncrementFontSizeButton />
    </div>
  );
});

export const LeftStatusBar = React.memo(() => {
  const { id: projectId } = React.useContext(ProjectContext);
  const mode = useAtomValue(AppState.projectDetail[projectId].mode);

  if (mode === Mode.Edit) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <PrevSlideButton />

      <SliderInfo />

      <NextSlideButton />
    </div>
  );
});

export const SliderInfo = React.memo(() => {
  const { id: projectId } = React.useContext(ProjectContext);
  const previewSlideIdx = useAtomValue(
    AppState.projectDetail[projectId].previewSlideIdx,
  );
  const slides = useAtomValue(AppState.projectDetail[projectId].slides);
  const totalSlides = slides.length;

  return (
    <div className="flex items-center overflow-hidden truncate shrink-0">
      <p className="text-xs text-muted-foreground font-bold whitespace-nowrap overflow-hidden truncate text-ellipsis">
        {(previewSlideIdx || 0) + 1} / {totalSlides}
      </p>
    </div>
  );
});

export const PrevSlideButton = React.memo(() => {
  const { id: projectId } = React.useContext(ProjectContext);
  return (
    <div
      className={adaptiveStyle}
      onClick={() => AppActions.PreviewPreviousSlide(projectId)}
    >
      <ChevronLeftIcon size={16} />
    </div>
  );
});

export const NextSlideButton = React.memo(() => {
  const { id: projectId } = React.useContext(ProjectContext);
  return (
    <div
      className={adaptiveStyle}
      onClick={() => AppActions.PreviewNextSlide(projectId)}
    >
      <ChevronRightIcon size={16} />
    </div>
  );
});

export const IncrementFontSizeButton = React.memo(() => {
  const { id: projectId } = React.useContext(ProjectContext);
  return (
    <div
      className={adaptiveStyle}
      onClick={() => AppActions.SetToggleEditorFontSIze(projectId, "up")}
    >
      <ZoomInIcon size={16} />
    </div>
  );
});

export const FontSizeInfo = React.memo(() => {
  const { id: projectId } = React.useContext(ProjectContext);
  const editorFontSize = useAtomValue(
    AppState.projectDetail[projectId].editorConfig.fontSize,
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          onClick={() => {
            AppActions.SetEditorFontSize(projectId, codeEditorConfig.fontSize);
          }}
        >
          <p className="text-xs text-muted-foreground font-bold whitespace-nowrap overflow-hidden truncate text-ellipsis">
            {editorFontSize}px
          </p>
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-black">
        <div className="flex items-center text-xs">
          <span>Reset To Default</span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
});

export const DecrementFontSizeButton = React.memo(() => {
  const { id: projectId } = React.useContext(ProjectContext);

  return (
    <div
      className={adaptiveStyle}
      onClick={() => AppActions.SetToggleEditorFontSIze(projectId, "down")}
    >
      <ZoomOutIcon size={16} />
    </div>
  );
});

export const ChangeThemeStatusBarItem = React.memo(() => {
  const { id: projectId } = React.useContext(ProjectContext);
  const [open, setOpen] = React.useState(false);
  const [editorTheme, setEditorTheme] = useAtom(
    AppState.projectDetail[projectId].editorTheme,
  );
  const setPreviewEditorTheme = useSetAtom(
    AppState.projectDetail[projectId].previewEditorTheme,
  );

  React.useEffect(() => {
    setPreviewEditorTheme(editorTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useHotkeys(
    ["ArrowDown", "ArrowUp"],
    () => {
      requestAnimationFrame(() => {
        const highlighted = document.querySelector(
          '[role="option"][aria-selected="true"][data-slot="command-item"]',
        ) as HTMLElement | null;

        if (highlighted) {
          const val = highlighted.getAttribute("data-value");

          if (val) {
            const theme = supportedHighlightJsThemes.find(
              (t) => t.label === val,
            );

            if (theme?.value) {
              setPreviewEditorTheme(theme.value);
            }
          }
        }
      });
    },
    { enabled: open, enableOnFormTags: true, enableOnContentEditable: true },
    [open],
  );

  const editorThemeLabel = React.useMemo(() => {
    return (
      supportedHighlightJsThemes.find((v) => v.value === editorTheme)?.label ||
      "N/A"
    );
  }, [editorTheme]);

  return (
    <div className="flex min-w-0 h-full items-center">
      <p
        className={`text-muted-foreground text-xs line-clamp-1 truncate cursor-pointer text-ellipsis ${adaptiveStyle}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {editorThemeLabel}
      </p>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="border-4 border-stone-200 rounded-3xl"
        showCloseButton={false}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
          setPreviewEditorTheme(null);
        }}
      >
        <div className="p-2">
          <CommandInput
            placeholder="Search Themes ..."
            onBlur={() => {
              setOpen(false);
              setPreviewEditorTheme(null);
            }}
          />
        </div>
        <Separator />
        <div className="p-2">
          <CommandList className="h-96">
            <CommandEmpty>No results found.</CommandEmpty>

            {supportedHighlightJsThemes?.map((a) => {
              return (
                <CommandItem
                  key={`language-${a.value}`}
                  className="h-10 text-sm overflow-hidden "
                  onSelect={() => {
                    setPreviewEditorTheme(null);
                    setEditorTheme(a.value);
                    setOpen(false);
                  }}
                  value={a.label}
                >
                  <span className="truncate line-clamp-1">{a.label}</span>
                </CommandItem>
              );
            })}
          </CommandList>
        </div>
        <div className="h-10 w-full bg-accent px-4 flex items-center">
          <div className="flex flex-1">
            <kbd className="bg-white text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
              <span className="text-xs">⏎</span>
            </kbd>
            <p className="text-sm ml-2 text-stone-400">Select language</p>
          </div>
          <div className="flex">
            <p className="text-sm ml-2 text-stone-400"> Use ↑ ↓ to navigate</p>
          </div>
        </div>
      </CommandDialog>
    </div>
  );
});

export const ChangeLanguangeStatusBarItem = React.memo(() => {
  const { id: projectId } = React.useContext(ProjectContext);
  const [open, setOpen] = React.useState(false);
  const [previewLanguage, setPreviewLanguage] = useAtom(
    AppState.projectDetail[projectId].previewLanguage,
  );
  const previewLanguageLabel = React.useMemo(() => {
    return languages.find((v) => v.value === previewLanguage)?.label || "N/A";
  }, [previewLanguage]);

  return (
    <div className="flex min-w-0 h-full items-center">
      <p
        className={`text-muted-foreground text-xs whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer ${adaptiveStyle}`}
        onClick={() => {
          setOpen(true);
        }}
      >
        {previewLanguageLabel}
      </p>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="border-4 border-stone-200 rounded-3xl"
        showCloseButton={false}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
        }}
      >
        <div className="p-2">
          <CommandInput
            placeholder="Search Languages ..."
            onBlur={() => {
              setOpen(false);
            }}
          />
        </div>
        <Separator />
        <div className="p-2">
          <CommandList className="h-96">
            <CommandEmpty>No results found.</CommandEmpty>

            {languages?.map((a) => {
              return (
                <CommandItem
                  key={`language-${a.value}`}
                  className="h-10 text-sm overflow-hidden "
                  onSelect={() => {
                    setPreviewLanguage(a.value);
                    setOpen(false);
                  }}
                  value={a.label}
                >
                  <span className="truncate line-clamp-1">{a.label}</span>
                </CommandItem>
              );
            })}
          </CommandList>
        </div>
        <div className="h-10 w-full bg-accent px-4 flex items-center">
          <div className="flex flex-1">
            <kbd className="bg-white text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
              <span className="text-xs">⏎</span>
            </kbd>
            <p className="text-sm ml-2 text-stone-400">Select language</p>
          </div>
          <div className="flex">
            <p className="text-sm ml-2 text-stone-400"> Use ↑ ↓ to navigate</p>
          </div>
        </div>
      </CommandDialog>
    </div>
  );
});
