import { useEffect, useState, memo } from "react";
import { toast } from "sonner";
import { writeText } from "tauri-plugin-clipboard-api";
import { AnimatePresence } from "framer-motion";

import { cn } from "@/vendor/shadcn/lib/utils";
import { useClipboardStore, type ClipItem } from "./clipboard-store";
import { AnimatedPage } from "@/vendor/components/animate-page";
import { APP_ID } from "../utils/constants";
import { Separator } from "@/vendor/shadcn/components/ui/separator";

const MemoItem = memo(function MemoItem({
  item,
  index,
  onSelect,
}: {
  item: ClipItem;
  index: number;
  onSelect: (i: number, el: HTMLDivElement) => void;
}) {
  return (
    <div
      data-index={index}
      data-selected="false"
      ref={(el) => {
        if (el) onSelect(index, el);
      }}
      className={cn(
        "min-h-10 rounded-md cursor-pointer text-sm border transition-all hover:bg-muted w-full p-2 h-10",
        "overflow-hidden", // important
        "truncate",
        "data-[selected=true]:border-primary",
        "data-[selected=true]:bg-muted",
        "data-[selected=true]:text-foreground"
      )}
      title={item?.content} // tooltip on hover for full content
    >
      {item?.content}
    </div>
  );
});

export default function ClipboardManager() {
  const items = useClipboardStore((s) => s.items);

  const [activeIndex, setActiveIndex] = useState(0);
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
    <div className="flex flex-1 min-h-0">
      <AnimatePresence mode="wait">
        <AnimatedPage id={APP_ID} classname="flex flex-1 flex-col min-w-0">
          <div className="p-8 flex flex-1 min-h-0 gap-4">
            <div className="flex flex-col min-w-80 max-w-80 p-4 gap-2 border rounded-md overflow-y-scroll min-h-0">
              {items.map((item, i) => (
                <MemoItem
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

            <div className="flex flex-1 flex-col border rounded-md min-w-0">
              <div className="flex flex-1 p-6 overflow-y-scroll h-full">
                {items[activeIndex]?.content}
              </div>
              <Separator />
              <div className="flex gap-1 flex-col p-4">
                <div className="flex justify-between">
                  <p>
                    copied:
                  </p>
                  <p>
                    {items[activeIndex]?.count
                      ? `${items[activeIndex]?.count}`
                      : ""}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>
                    Date:
                  </p>
                  <p>
                    {items[activeIndex]?.createdAt}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedPage>
      </AnimatePresence>
    </div>
  );
}
