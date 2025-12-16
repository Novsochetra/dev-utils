import { memo, type Dispatch } from "react";
import { List, type RowComponentProps } from "react-window";

import { Input } from "@/vendor/shadcn/components/ui/input";
import type { SearchResultItem } from "../home-screen";
import {
  ClipboardListItem,
  type ClipboardListItemProps,
} from "./clipboard-list-item";

export const ClipboardList = memo(
  ({
    filteredItems,
    searchQuery,
    setSearchQuery,
    setActiveIndex,
    setItemElement,
    activeIndex,
  }: {
    filteredItems: SearchResultItem[];
    searchQuery: string;
    activeIndex: number;
    setActiveIndex: Dispatch<React.SetStateAction<number>>;
    setSearchQuery: Dispatch<React.SetStateAction<string>>;
    setItemElement: (index: number, el: HTMLDivElement) => void;
  }) => {
    const onSelect = (index: number, el: HTMLDivElement) => {
      setItemElement(index, el);
    };

    return (
      <div className="flex flex-col flex-1 relative max-w-80">
        <div className="absolute top-0 left-0 z-10 w-full px-4 pt-4 pb-2">
          <Input
            type="text"
            placeholder="Search clipboard..."
            className="p-2 border rounded-md h-9"
            value={searchQuery}
            autoFocus
            spellCheck="false"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <List
          style={{ marginTop: 36 + 16 + 8 }}
          rowComponent={RowComponent}
          rowCount={filteredItems.length}
          rowHeight={36}
          rowProps={{
            names: filteredItems,
            onSelect,
            activeIndex,
            setActiveIndex,
          }}
        />
      </div>
    );
  }
);

function RowComponent({
  index,
  names,
  style,
  onSelect,
  activeIndex,
  setActiveIndex,
}: RowComponentProps<{
  names: SearchResultItem[];
  onSelect: ClipboardListItemProps["onSelect"];
  activeIndex: number;
  setActiveIndex: Dispatch<React.SetStateAction<number>>;
}>) {
  return (
    <div style={style} className="px-4">
      <ClipboardListItem
        item={names[index]}
        index={index}
        onSelect={onSelect}
        isActive={activeIndex === index}
        setActiveIndex={setActiveIndex}
      />
    </div>
  );
}
