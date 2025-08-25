import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, } from "react-router";
import { useHotkeys } from 'react-hotkeys-hook'

import {
  ChevronLeft,
  Calendar,
} from "lucide-react";
import { Separator } from "@/vendor/shadcn/components/ui/separator";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/vendor/shadcn/components/ui/command";
import { getMiniApps } from "@/core/mini-app-registry";

type NavbarProps = {
  showBack?: boolean;
} & ({
  showSearchBar: true
} | {
  showSearchBar: false,
  title: string
});

const miniApps = getMiniApps();

export const Navbar = (props: NavbarProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  useHotkeys("esc", () => {
    if (location.pathname === "/" || location.pathname === "" || location.pathname === "/index") {
      return
    }

    navigate(-1)
  })

  return (
    <>
      <div className="flex px-8 py-4">
        <div className="h-10 flex items-center">
          {props.showBack ? (
            <Link to="/" className="flex">
              <ChevronLeft className="mr-4" />
              Back
            </Link>
          ) : (
            <Link to="/" className="flex">
              Home
            </Link>
          )}
        </div>

        {props.showSearchBar ?
          <div className="flex flex-1 justify-center">
            <CommandDialogDemo />
          </div>
          : <div className="flex flex-1 justify-center items-center">
            <h3 className="text-lg font-semibold">{props.title}</h3>
          </div>
        }

        <div>
          <p>Right Menu</p>
        </div>
      </div>
      <Separator />
    </>
  );
};

export function CommandDialogDemo() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);

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
        className="w-96 px-4 bg-stone-100 flex items-center rounded-md hover:bg-stone-50 transition-colors duration-300"
        onClick={() => {
          setOpen(true);
        }}
      >
        <p className="text-muted-foreground text-sm flex flex-1">
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
      >
        <div className="p-2">
          <CommandInput placeholder="Search apps ..." />
        </div>
        <Separator />
        <div className="p-2">
          <CommandList className="h-96">
            <CommandEmpty>No results found.</CommandEmpty>
            {miniApps.map((a, index) => {
              return (
                <CommandItem
                  key={`cmdk-item-${index}`}
                  className="h-10 text-sm overflow-hidden "
                  onSelect={() => {
                    navigate(a.basePath)
                  }}
                  keywords={[]}
                >
                  <Calendar />
                  <span className="truncate line-clamp-1">{a.name}</span>
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
