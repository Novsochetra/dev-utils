import { ClipboardIcon } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import { isMac } from "@/utils/is-desktop-mode";
import { AnimatedPage } from "@/vendor/components/animate-page";
import { APP_ID } from "../../utils/constants";

export const Empty = () => {
  const renderMacShortcutKey = () => {
    return (
      <div className="flex gap-2">
        <kbd className="bg-white text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
          <span className="text-xs">⌘</span>
        </kbd>
        <kbd className="bg-white text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
          <span className="text-xs">n</span>
        </kbd>
      </div>
    );
  };

  const renderWindowShortcutKey = () => {
    return (
      <div className="flex gap-2">
        <kbd className="bg-white text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
          <span className="text-xs">Ctrl</span>
        </kbd>
        <kbd className="bg-white text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
          <span className="text-xs">n</span>
        </kbd>
      </div>
    );
  };

  return (
    <div className="flex flex-1 min-h-0">
      <AnimatePresence mode="wait">
        <AnimatedPage id={APP_ID} classname="flex flex-1 flex-col min-w-0">
          <div className="flex flex-1 flex-col justify-center items-center gap-4">
            <div className="p-3 rounded-full bg-muted text-muted-foreground/60">
              <ClipboardIcon className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-semibold text-foreground">
              Your Bookmark Is Empty
            </h3>

            <p className="text-base text-muted-foreground max-w-sm text-center">
              To begin, simply copy any url.
            </p>

            <div className="flex items-center gap-2 text-sm text-primary font-medium">
              <span className="text-muted-foreground">Shortcut:</span>
              {isMac ? renderMacShortcutKey() : renderWindowShortcutKey()}
            </div>
          </div>
        </AnimatedPage>
      </AnimatePresence>
    </div>
  );
};
