import { memo } from "react";
import { cn } from "@/vendor/shadcn/lib/utils";
import { useClipboardStore, type ClipItem } from "../../state/state";
import { TrashIcon } from "lucide-react";

export const ClipboardListItem = memo(function MemoItem({
  item,
  index,
  onSelect,
}: {
  item: ClipItem;
  index: number;
  onSelect: (i: number, el: HTMLDivElement) => void;
}) {
  const removeClipboardItem = useClipboardStore(state => state.removeItem)

  return (
    <div
      data-index={index}
      data-selected="false"
      ref={(el) => {
        if (el) onSelect(index, el);
      }}
      className={cn(
        "cursor-pointer text-sm transition-all hover:bg-muted hover:rounded-md w-full px-4 py-2",
        "relative group",
        "overflow-hidden", // important
        "truncate",
        "data-[selected=true]:rounded-md",
        "data-[selected=true]:bg-muted",
        "data-[selected=true]:text-foreground"
      )}
      title={item?.content} // tooltip on hover for full content
    >
      {item?.content}

      {/* 2. Floating Delete Icon/Button */}
      <button
        // Ensures the button takes priority for clicks
        onClick={(e) => {
          e.stopPropagation(); // Prevent the parent 'onSelect' from firing
          removeClipboardItem(item.id)
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