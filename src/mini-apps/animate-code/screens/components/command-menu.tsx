import React, { useContext, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandSeparator,
} from "@/vendor/shadcn/components/ui/command";
import { Separator } from "@/vendor/shadcn/components/ui/separator";
import {
  Mode,
  supportedHighlightJsLanguages,
  supportedHighlightJsThemes,
} from "../../utils/constants";
import { useEditorThemes } from "../../utils/hooks/use-editor-themes";
import {
  LanguagesIcon,
  MonitorDownIcon,
  MonitorOffIcon,
  MonitorPlayIcon,
  MonitorUpIcon,
  PaletteIcon,
} from "lucide-react";
import { ShortCuts } from "./shortcuts";
import { ProjectContext } from "./project-context";
import { useStore } from "../../state/state";

export const CommandMenu = React.memo(() => {
  const { id: projectId } = useContext(ProjectContext);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState<"main" | "language" | "theme">("main");
  const setEditorPreviewTheme = useStore(
    (state) => state.setEditorPreviewTheme,
  );

  useEditorThemes();

  useHotkeys(
    "meta+k,ctrl+k",
    (e) => {
      e.preventDefault();
      setOpen((o) => !o);
      setPage("main");
    },
    { enableOnFormTags: true, enableOnContentEditable: true },
  );

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      className="border-4 border-stone-200 rounded-3xl"
      showCloseButton={false}
      onEscapeKeyDown={(e) => {
        e.stopPropagation();

        setOpen(false);
        // page specific behaviour
        if (page === "theme") {
          setEditorPreviewTheme(projectId, null);
        }
      }}
    >
      <div className="p-2">
        <CommandInput
          value={search}
          onValueChange={(v) => setSearch(v)}
          placeholder={
            page === "main"
              ? "Search commands..."
              : page === "language"
                ? "Search languages..."
                : "Search themes..."
          }
          onBlur={() => {
            setOpen(false);
          }}
        />
      </div>

      <Separator />

      <div className="p-2">
        <CommandList className="h-96">
          <CommandEmpty>No results found.</CommandEmpty>

          {page === "main" && (
            <MainPageMenu
              setPage={setPage}
              setSearch={setSearch}
              setOpen={setOpen}
            />
          )}

          {page === "language" && (
            <ListLanguagesCommandItem setOpen={setOpen} />
          )}

          {page === "theme" && <ListThemesCommandItem setOpen={setOpen} />}
        </CommandList>
      </div>

      {/* Footer */}
      <div className="h-10 w-full bg-accent px-4 flex items-center">
        <div className="flex flex-1">
          <kbd className="bg-white text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            <span className="text-xs">⏎</span>
          </kbd>
          <p className="text-sm ml-2 text-stone-400">Select</p>
        </div>
        <div className="flex">
          <p className="text-sm ml-2 text-stone-400"> Use ↑ ↓ to navigate</p>
        </div>
      </div>
    </CommandDialog>
  );
});

export const ListThemesCommandItem = React.memo(
  ({ setOpen }: { setOpen: (v: boolean) => void }) => {
    const { id: projectId } = useContext(ProjectContext);
    const getEditorTheme = useStore((state) => state.getEditorTheme);
    const setEditorTheme = useStore((state) => state.setEditorTheme);
    const setEditorPreviewTheme = useStore(
      (state) => state.setEditorPreviewTheme,
    );

    React.useEffect(() => {
      const editorTheme = getEditorTheme(projectId);
      setEditorPreviewTheme(projectId, editorTheme);
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

              setEditorPreviewTheme(projectId, theme?.value || null);
            }
          }
        });
      },
      { enableOnFormTags: true },
    );

    return supportedHighlightJsThemes?.map((a) => {
      return (
        <CommandItem
          key={`language-${a.value}`}
          className="h-10 text-sm overflow-hidden "
          onSelect={() => {
            setEditorPreviewTheme(projectId, null);
            setEditorTheme(projectId, a.value);
            setOpen(false);
          }}
          value={a.label}
        >
          <span className="truncate line-clamp-1">{a.label}</span>
        </CommandItem>
      );
    });
  },
  () => true,
);

export const ListLanguagesCommandItem = React.memo(
  ({ setOpen }: { setOpen: (v: boolean) => void }) => {
    const { id: projectId } = useContext(ProjectContext);
    const setPreviewLanguage = useStore((state) => state.setPreviewLanguage);

    return supportedHighlightJsLanguages.map((a) => (
      <CommandItem
        key={`lang-${a.value}`}
        className="h-10 text-sm overflow-hidden "
        onSelect={() => {
          setPreviewLanguage(projectId, a.value);
          setOpen(false);
        }}
      >
        {a.label}
      </CommandItem>
    ));
  },
  () => true,
);

export const MainPageMenu = React.memo(
  ({
    setSearch,
    setPage,
    setOpen,
  }: {
    setSearch: (v: string) => void;
    setPage: (v: "main" | "theme" | "language") => void;
    setOpen: (v: boolean) => void;
  }) => {
    const { id: projectId } = useContext(ProjectContext);
    const previewMode = useStore(
      (state) => state.projectDetail[projectId].mode,
    );
    const previewPreviousSlide = useStore(
      (state) => state.previewPreviousSlide,
    );
    const previewNextSlide = useStore((state) => state.previewNextSlide);
    const setMode = useStore((state) => state.setMode);

    return (
      <>
        <CommandItem
          className="h-10 text-sm overflow-hidden "
          onSelect={() => {
            setPage("theme");
            setSearch("");
            setOpen(true);
          }}
        >
          <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
            <PaletteIcon className="text-stone-500" />
          </div>
          Change Theme
        </CommandItem>
        <CommandItem
          className="h-10 text-sm overflow-hidden "
          onSelect={() => {
            setPage("language");
            setSearch("");
            setOpen(true);
          }}
        >
          <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
            <LanguagesIcon className="text-stone-500" />
          </div>
          Change Language
        </CommandItem>

        {previewMode === Mode.Preview ? (
          <>
            <CommandSeparator className="my-2" />
            <CommandItem
              className="h-10 text-sm overflow-hidden "
              onSelect={() => {
                setOpen(false);
                setSearch("");
                previewPreviousSlide(projectId);
              }}
            >
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <MonitorUpIcon className="text-stone-500" />
              </div>
              Go To Previous Slide
              <div className="flex items-center space-x-1 text-xs shrink grow-0  overflow-hidden ml-auto">
                <kbd className="px-1 py-0.5 rounded border bg-gray-100 flex-shrink-0">
                  ArrowLeft
                </kbd>
              </div>
            </CommandItem>
            <CommandItem
              className="h-10 text-sm overflow-hidden "
              onSelect={() => {
                setOpen(false);
                setSearch("");
                previewNextSlide(projectId);
              }}
            >
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <MonitorDownIcon className="text-stone-500" />
              </div>
              Go To Next Slide
              <div className="flex items-center space-x-1 text-xs shrink grow-0  overflow-hidden ml-auto">
                <kbd className="px-1 py-0.5 rounded border bg-gray-100 flex-shrink-0">
                  ArrowRight
                </kbd>
              </div>
            </CommandItem>
            <CommandItem
              className="h-10 text-sm overflow-hidden "
              onSelect={() => {
                setOpen(false);
                setSearch("");
                setMode(projectId, Mode.Edit);
              }}
            >
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <MonitorOffIcon className="text-stone-500" />
              </div>
              Exit Preview Mode
              <div className="flex items-center space-x-1 text-xs shrink grow-0  overflow-hidden ml-auto">
                <kbd className="px-1 py-0.5 rounded border bg-gray-100 flex-shrink-0">
                  Esc
                </kbd>
              </div>
            </CommandItem>
          </>
        ) : (
          <>
            <CommandSeparator className="my-2" />

            <CommandItem
              className="h-10 text-sm overflow-hidden "
              onSelect={() => {
                setOpen(false);
                setSearch("");
                setMode(projectId, Mode.Preview);
              }}
            >
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <MonitorPlayIcon className="text-stone-500" />
              </div>
              Enter Preview Mode
              <div className="flex items-center space-x-1 text-xs shrink grow-0  overflow-hidden ml-auto">
                <ShortCuts keys={["⌘", "Enter"]} />
              </div>
            </CommandItem>
          </>
        )}
      </>
    );
  },
  () => true,
);
