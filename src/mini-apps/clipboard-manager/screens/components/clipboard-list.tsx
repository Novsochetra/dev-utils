import { memo, useCallback, type Dispatch } from "react";
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
    const onSelect = useCallback(
      (index: number, el: HTMLDivElement) => {
        setItemElement(index, el);
        el.onclick = () => {
          setActiveIndex(index);
          updateDataset(index);
        };
      },
      [setActiveIndex, updateDataset, setItemElement]
    );

    return (
      <div className="flex flex-col flex-1 min-w-20 max-w-80 min-h-0 px-4 pb-4">
        <div className="sticky top-0 bg-background z-10 pt-4">
          <Input
            type="text"
            placeholder="Search clipboard..."
            className="mb-2 p-2 border rounded-md"
            value={searchQuery}
            autoFocus
            spellCheck="false"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-1 flex-col min-h-0 overflow-auto">
          <List
            rowComponent={RowComponent}
            rowCount={filteredItems.length}
            rowHeight={36}
            rowProps={{ names: filteredItems, onSelect }}
          />
        </div>
      </div>
    );
  }
);

function RowComponent({
  index,
  names,
  style,
  onSelect,
}: RowComponentProps<{
  names: SearchResultItem[];
  onSelect: ClipboardListItemProps["onSelect"];
}>) {
  return (
    <div style={style}>
      <ClipboardListItem
        item={names[index]}
        index={index}
        onSelect={onSelect}
      />
    </div>
  );
}
