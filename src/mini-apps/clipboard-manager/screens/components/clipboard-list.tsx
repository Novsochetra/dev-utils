import { memo, useEffect, type Dispatch } from "react";
import { toast } from "sonner";
import { writeText } from "tauri-plugin-clipboard-api";

import { useClipboardStore } from "../../state/state";
import { ClipboardListItem } from "./clipboard-list-item";

export const ClipboardList = memo(({
  activeIndex, 
  setActiveIndex
}: {
  activeIndex: number, 
  setActiveIndex: Dispatch<React.SetStateAction<number>>
}) => {
  const items = useClipboardStore((s) => s.items);

  
  const itemElements: HTMLDivElement[] = [];

  const setItemElement = (i: number, el: HTMLDivElement) => {
    itemElements[i] = el;
  };

  const updateDataset = (newIndex: number) => {
    itemElements.forEach((el, i) => {
      if (!el) return;
      el.dataset.selected = i === newIndex ? "true" : "false";
    });
  };

  // initial highlight
  useEffect(() => {
    updateDataset(activeIndex);
  }, []);

  // keyboard
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      let newIndex = activeIndex;

      if (e.key === "ArrowDown")
        newIndex = Math.min(newIndex + 1, items.length - 1);
      if (e.key === "ArrowUp") newIndex = Math.max(newIndex - 1, 0);
      if (e.key === "Enter") {
        const item = items[activeIndex];
        if (item && item.type === "text") {
          writeText(item.content);
          toast.success("Copied to clipboard!");
        }
      }

      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
        updateDataset(newIndex);

        // ⚡ Auto-scroll active item into view
        const el = itemElements[newIndex];
        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "nearest", // keep item visible but don't scroll too aggressively
          });
        }
      }
    };

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [activeIndex]);
  
  return (
    <div className="flex flex-col flex-1 min-w-20 max-w-80 overflow-y-scroll min-h-0 p-4">
      {items.map((item, i) => (
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
});
