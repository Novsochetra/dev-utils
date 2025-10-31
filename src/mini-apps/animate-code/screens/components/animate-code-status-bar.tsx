import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/vendor/shadcn/components/ui/command";
import { useAtom } from "jotai";
import { AppState } from "../../state/state";
import { Separator } from "@/vendor/shadcn/components/ui/separator";
import { supportedHighlightJsLanguages } from "../../utils/constants";

const languages = supportedHighlightJsLanguages?.map((v) => ({
  label: v.label,
  value: v.value,
}));

export const AnimateCodeStatusBar = React.memo(() => {
  const [open, setOpen] = React.useState(false);
  const [previewLanguage, setPreviewLanguage] = useAtom(
    AppState.previewLanguage,
  );
  const previewLanguageLabel = React.useMemo(() => {
    return languages.find((v) => v.value === previewLanguage)?.label || "N/A";
  }, [previewLanguage]);

  return (
    <div className="w-full h-8 flex px-1 border-t border-t-black/20">
      <div className="flex flex-1"></div>
      <div className="flex flex-1"></div>
      <div className="flex flex-1 items-center justify-end">
        <div
          className="px-2 py-1 hover:bg-black/20 rounded-sm"
          onClick={() => {
            setOpen(true);
          }}
        >
          <p className="text-muted-foreground text-xs line-clamp-1 truncate">
            {previewLanguageLabel}
          </p>
        </div>

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
            <CommandInput placeholder="Search Languages ..." />
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
              <p className="text-sm ml-2 text-stone-400">
                {" "}
                Use ↑ ↓ to navigate
              </p>
            </div>
          </div>
        </CommandDialog>
      </div>
    </div>
  );
});
