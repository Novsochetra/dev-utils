import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useHotkeys } from "react-hotkeys-hook";
import { PackageIcon } from "lucide-react";

import { Separator } from "@/vendor/shadcn/components/ui/separator";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/vendor/shadcn/components/ui/command";
import { getMiniApps } from "@/core/mini-app-registry";
import { useAppSuggestions } from "./use-app-suggestions";
import { motion } from "framer-motion";

type NavbarProps = {
  showBack?: boolean;
  enableBackListener?: boolean;
  enableBackOnFormTags?: boolean;
} & (
  | {
      showSearchBar: true;
    }
  | {
      showSearchBar: false;
      title: string;
    }
);

export const Navbar = (props: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useHotkeys(
    "esc",
    () => {
      if (props.enableBackListener) {
        if (
          location.pathname === "/" ||
          location.pathname === "" ||
          location.pathname === "/index"
        ) {
          return;
        }

        navigate(-1);
      }
    },
    { enableOnFormTags: props.enableBackOnFormTags },
  );

  return (
    <motion.div layout className="flex flex-1 min-h-12 h-12 min-w-0">
      
      <div className="flex flex-1 justify-center p-2 min-w-0" data-tauri-drag-region>
        {props.showSearchBar ? (
          <div className="flex flex-1 justify-center max-w-[600px] min-w-0">
            <CommandDialogDemo />
          </div>
        ) : (
          <div
            data-tauri-drag-region
            className="flex flex-1 justify-center items-center overflow-hidden min-w-0"
          >
            <h3 className="font-semibold truncate">{props.title}</h3>
          </div>
        )}
      </div>

    </motion.div>
  );
};

export function CommandDialogDemo() {
  const miniApps = getMiniApps();

  const { data: suggestionApps, update: updateSuggestion } =
    useAppSuggestions(miniApps);

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <div
        data-tauri-drag-region={false}
        className="flex flex-1 min-w-0 justify-between bg-stone-100 items-center rounded-md hover:bg-stone-50 transition-colors duration-300 p-2"
        onClick={() => {
          setOpen(true);
        }}
      >
        <p className="text-muted-foreground text-sm truncate">
          Search apps{" "}
        </p>

        <div className="flex gap-2">
          <kbd className="bg-white text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            <span className="text-xs">⌘</span>
          </kbd>
          <kbd className="bg-white text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            <span className="text-xs">K</span>
          </kbd>
        </div>
      </div>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="border-4 border-stone-200 rounded-3xl"
        showCloseButton={false}
        onKeyDown={(e) => {
          // prevent event from bubble up
          // like when no mini app clipboard manager there also event enter listener
          // so if we show the navbar and press enter the clipboard manager event will be execute also
          if (e.key === 'Enter') {
            e.stopPropagation()
          }
        }}
      >
        <div className="p-2">
          <CommandInput
            className="h-8"
            placeholder="Search apps ..."
            onValueChange={(s) => {
              setSearch(s);
            }}
          />
        </div>
        <Separator />
        <div className="p-2">
          <CommandList className="h-96">
            <CommandEmpty>No results found.</CommandEmpty>

            {!search ? (
              <>
                <CommandGroup heading="Suggestions">
                  {suggestionApps?.map((a) => {
                    return (
                      <CommandItem
                        id={`suggestion-app-${a.id}`}
                        key={`suggestion-app-${a.id}`}
                        className="h-10 text-sm overflow-hidden "
                        onSelect={() => {
                          setOpen(false);
                          updateSuggestion(a.id, a);
                          navigate(a.basePath);
                        }}
                        keywords={[]}
                        // INFO: we don't allow search in suggestion
                        value={`suggestion-app-${a.id}`}
                      >
                        <AppIcon />
                        <span className="truncate line-clamp-1">{a.name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>

                <CommandSeparator className="my-2" />
              </>
            ) : null}

            <CommandGroup heading={search ? "Result" : "Apps"}>
              {miniApps.map((a, index) => {
                return (
                  <CommandItem
                    id={`cmdk-item-${index}`}
                    key={`cmdk-item-${index}`}
                    className="h-10 text-sm overflow-hidden "
                    onSelect={() => {
                      setOpen(false);
                      updateSuggestion(a.id, a);
                      navigate(a.basePath);
                    }}
                    value={a.name}
                    keywords={[]}
                  >
                    <AppIcon />
                    <span className="truncate line-clamp-1">{a.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </div>
        <div className="h-10 w-full bg-accent px-4 flex items-center">
          <div className="flex flex-1">
            <kbd className="bg-white text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
              <span className="text-xs">⏎</span>
            </kbd>
            <p className="text-sm ml-2 text-stone-400"> Select app</p>
          </div>
          <div className="flex">
            <p className="text-sm ml-2 text-stone-400"> Use ↑ ↓ to navigate</p>
          </div>
        </div>
      </CommandDialog>
    </>
  );
}

const AppIcon = ({ icon }: { icon?: string }) => {
  return (
    <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
      {icon ? (
        <img src={icon} className="w-full h-full object-cover" />
      ) : (
        <PackageIcon className="text-stone-500" />
      )}
    </div>
  );
};
