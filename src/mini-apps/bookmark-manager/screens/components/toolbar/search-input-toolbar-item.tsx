import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { SearchIcon } from "lucide-react";
import { useState, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Button } from "@/vendor/shadcn/components/ui/button";

export const SearchInputToolbarItem = ({value, onChangeText}: {value: string, onChangeText: (value: string) => void}) => {
  const [expandedSearch, setExpandedSearch] = useState(value ? true : false);
  const inputRef = useRef<HTMLInputElement>(null);

  useHotkeys(
    "Slash",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setExpandedSearch(true)
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

    },
    { enabled: !expandedSearch },
  );

  return (
    <div className="flex items-center relative pr-1">
      <Button
        tabIndex={-1}
        size="sm"
        variant="ghost"
        className={clsx(
          "transition-colors",
          expandedSearch ? "absolute z-50 left-0" : "relative"
        )}
        disabled={expandedSearch}
        onClick={() => {
          setExpandedSearch(true);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);
        }}
      >
        <SearchIcon />
      </Button>

      <AnimatePresence>
        {expandedSearch ? (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 180 }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="h-8 flex items-center overflow-visible mr-[1px]"
          >
            <input
              type="text"
              ref={inputRef}
              className="w-full h-[26px] bg-accent pl-8 pr-2 rounded-md"
              value={value}
              spellCheck="false"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  if(value) {
                    // reset the text if user is press escape when having value
                    onChangeText("")
                  } else {
                    setExpandedSearch(false);
                  }

                  e.stopPropagation();
                }
              }}
              onBlur={(e) => {
                e.stopPropagation();

                if(!value) {
                  setExpandedSearch(false);
                }
              }}
              onChange={(e) => onChangeText(e.target.value)}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
