import { ClipboardIcon } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import { AnimatedPage } from "@/vendor/components/animate-page";
import { APP_ID } from "../../utils/constants";

export const EmptySearch = () => {

  return (
    <div className="flex flex-1 min-h-0">
      <AnimatePresence mode="wait">
        <AnimatedPage id={APP_ID} classname="flex flex-1 flex-col min-w-0">
          <div className="flex flex-1 flex-col justify-center items-center gap-4">
            <div className="p-3 rounded-full bg-muted text-muted-foreground/60">
              <ClipboardIcon className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-semibold text-foreground">
              No results found. 
            </h3>

            <p className="text-base text-muted-foreground max-w-sm text-center">
              Try a different keyword or refine your search.
            </p>
          </div>
        </AnimatedPage>
      </AnimatePresence>
    </div>
  );
};
