import { memo, useRef, type Dispatch } from "react";
import { TrashIcon } from "lucide-react";
import clsx from "clsx";

import { cn } from "@/vendor/shadcn/lib/utils";
import { useBookmarkStore, type BookmarkItem } from "../../state/state";

export type BookmarkListItemProps = {
  item: BookmarkItem;
  index: number;
  isActive: boolean;
  onSelect: (i: number, el: HTMLDivElement) => void;
  setActiveIndex: Dispatch<React.SetStateAction<number>>;
};

export const BookmarkListItem = memo(function MemoItem({
  item,
  index,
  onSelect,
  isActive,
  setActiveIndex,
}: BookmarkListItemProps) {
  const removeBookmark = useBookmarkStore((s) => s.removeBookmark);
  const updateBookmark = useBookmarkStore((s) => s.updateBookmark);
  const searchQuery = useBookmarkStore((s) => s.searchBookmarkQuery);
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div
      data-index={index}
      data-selected={isActive ? "true" : "false"}
      ref={(el) => {
        if (el) onSelect(index, el);
      }}
      onClick={() => setActiveIndex(index)}
      className={cn(
        "cursor-pointer text-sm transition-all hover:bg-muted hover:rounded-md w-full px-4 py-2 min-h-9",
        "relative group",
        "overflow-hidden", // important
        "truncate",
        "data-[selected=true]:rounded-md",
        "data-[selected=true]:bg-muted",
        "data-[selected=true]:text-foreground"
      )}
      title={item?.name} // tooltip on hover for full content
    >
      {item.icon ? (
        <img
          src={item.icon}
          className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2"
        />
      ) : null}
      <input
        ref={inputRef}
        type="text"
        name="editor-title-input"
        value={item?.name}
        disabled={!!searchQuery}
        className={clsx(
          "outline-none focus-visible:outline-none w-full overflow-scroll truncate text-ellipsis line-clamp-1",
          item.icon && "pl-4"
        )}
        onChange={(e) => updateBookmark(item.id, { name: e.target.value })}
        onKeyDown={(e) => {
          // INFO: after we change the form we normal press enter
          // so don't open the url, since we already has event listener
          if (e.key === "Enter" || e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            inputRef.current?.blur()
          }
        }}
      />

      <button
        onClick={(e) => {
          e.stopPropagation();
          removeBookmark(item.id);
          setActiveIndex(index > 0 ? index - 1 : 0);
        }}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 bg-destructive",
          "h-6 w-6 p-1 rounded-sm",
          "opacity-0 group-hover:opacity-100", // KEY: Hidden by default, visible on group hover
          "transition-opacity duration-150 ease-in-out"
        )}
        aria-label={`Delete item ${index}`}
        title="Delete Item"
      >
        <TrashIcon className="h-4 w-4 text-white" />
      </button>
    </div>
  );
});
