import { memo, useCallback, type Dispatch } from "react";

import { Input } from "@/vendor/shadcn/components/ui/input";
import { StaggeredListContainer } from "@/vendor/components/staggered-list-container";
import { ClipboardListItem } from "./clipboard-list-item";
import type { SearchResultItem } from "../home-screen";
import { AnimatePresence, motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const ClipboardList = memo(
  ({
    filteredItems,
    searchQuery,
    setSearchQuery,
    setActiveIndex,
    setItemElement,
    updateDataset,
  }: {
    filteredItems: SearchResultItem[];
    searchQuery: string;
    activeIndex: number;
    setActiveIndex: Dispatch<React.SetStateAction<number>>;
    setSearchQuery: Dispatch<React.SetStateAction<string>>;
    setItemElement: (index: number, el: HTMLDivElement) => void;
    updateDataset: (index: number) => void;
  }) => {
    const onSelect = useCallback((index: number, el: HTMLDivElement) => {
      setItemElement(index, el);
      el.onclick = () => {
        setActiveIndex(index);
        updateDataset(index);
      };
    }, []);

    const animateProps = searchQuery
      ? { animationKey: filteredItems.length.toString() }
      : {};

    return (
      <div className="flex flex-col flex-1 min-w-20 max-w-80 overflow-y-scroll min-h-0 p-4">
        <Input
          type="text"
          placeholder="Search clipboard..."
          className="mb-2 p-2 border rounded-md"
          value={searchQuery}
          autoFocus
          spellCheck="false"
          onChange={(e) => setSearchQuery(e.target.value)}
        />

       <StaggeredListContainer {...animateProps}>
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, i) => (
              <motion.div key={searchQuery ? `search-item-${i}`: item.id} variants={itemVariants}>
                <ClipboardListItem item={item} index={i} onSelect={onSelect} />
              </motion.div>
            ))}
          </AnimatePresence>
        </StaggeredListContainer>
      </div>
    );
  }
);
