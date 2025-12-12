import { memo, type Dispatch } from "react";

import { Input } from "@/vendor/shadcn/components/ui/input";
import { ClipboardListItem } from "./clipboard-list-item";
import type { SearchResultItem } from "../home-screen";

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
    return (
      <div className="flex flex-col flex-1 min-w-20 max-w-80 overflow-y-scroll min-h-0 p-4">
        {/* Search Input */}
        <Input
          type="text"
          placeholder="Search clipboard..."
          className="mb-2 p-2 border rounded-md"
          value={searchQuery}
          autoFocus
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {filteredItems.map((item, i) => (
          <ClipboardListItem
            key={i}
            item={item}
            index={i}
            onSelect={(index, el) => {
              setItemElement(index, el);
              el.onclick = () => {
                setActiveIndex(index);
                updateDataset(index);
              };
            }}
          />
        ))}
      </div>
    );
  }
);
