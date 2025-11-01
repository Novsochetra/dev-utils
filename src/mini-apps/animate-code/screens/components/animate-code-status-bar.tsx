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

import { AppState, slideLengthAtom } from "../../state/state";
import { Separator } from "@/vendor/shadcn/components/ui/separator";
import {
  supportedHighlightJsLanguages,
  supportedHighlightJsThemes,
} from "../../utils/constants";

const languages = supportedHighlightJsLanguages?.map((v) => ({
  label: v.label,
  value: v.value,
}));

export const AnimateCodeStatusBar = React.memo(() => {
  return (
    <div className="max-h-8 flex flex-1 px-2 border-t border-t-black/20 gap-4">
      <LeftStatusBar />

      <div className="flex flex-1 min-w-0 gap-2 justify-end items-center">
        <ChangeThemeStatusBarItem />
        <div className="h-4 w-[1px] bg-border" />
        <ChangeLanguangeStatusBarItem />
      </div>
    </div>
  );
});

export const LeftStatusBar = React.memo(() => {
  const previewSlideIdx = useAtomValue(AppState.previewSlideIdx);
  const totalSlides = useAtomValue(slideLengthAtom);
  return (
    <div className="flex items-center overflow-hidden truncate shrink-0">
      <p className="text-xs text-muted-foreground font-bold whitespace-nowrap overflow-hidden truncate text-ellipsis">
        {(previewSlideIdx || 0) + 1} / {totalSlides}
      </p>
    </div>
  );
});

export const ChangeThemeStatusBarItem = React.memo(() => {
  const [open, setOpen] = React.useState(false);
  const [editorTheme, setEditorTheme] = useAtom(AppState.editorTheme);
  const setPreviewEditorTheme = useSetAtom(AppState.previewEditorTheme);

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
            setPreviewEditorTheme(theme?.value || "");
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
    <div className="flex min-w-0" onClick={() => setOpen(true)}>
      <p className="text-muted-foreground text-xs line-clamp-1 truncate text-ellipsis">
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
          setPreviewEditorTheme("");
        }}
      >
        <div className="p-2">
          <CommandInput
            placeholder="Search Languages ..."
            onBlur={() => {
              setOpen(false);
              setPreviewEditorTheme("");
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
  const [open, setOpen] = React.useState(false);
  const [previewLanguage, setPreviewLanguage] = useAtom(
    AppState.previewLanguage,
  );
  const previewLanguageLabel = React.useMemo(() => {
    return languages.find((v) => v.value === previewLanguage)?.label || "N/A";
  }, [previewLanguage]);

  return (
    <div
      className="flex min-w-0"
      onClick={() => {
        setOpen(true);
      }}
    >
      <p className="text-muted-foreground text-xs whitespace-nowrap overflow-hidden text-ellipsis">
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
