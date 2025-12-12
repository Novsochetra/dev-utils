import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Fuse, { type FuseResultMatch } from "fuse.js";
import { writeText } from "tauri-plugin-clipboard-api";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";

import { AnimatedPage } from "@/vendor/components/animate-page";
import { Separator } from "@/vendor/shadcn/components/ui/separator";
import { useClipboardStore, type ClipItem } from "../state/state";
import { APP_ID } from "../utils/constants";
import { ClipboardList } from "./components/clipboard-list";
import { Empty } from "./components/empty";

export type SearchResultItem = {
  matches: readonly FuseResultMatch[] | undefined;
  id: string;
  type: "text" | "image";
  content: string;
  pinned: boolean;
  createdAt: string;
  count: number;
};

export default function ClipboardManager() {
  const itemElements: HTMLDivElement[] = [];
  const [activeIndex, setActiveIndex] = useState(0);
  const items = useClipboardStore((s) => s.items) as (ClipItem & {
    matches: FuseResultMatch[];
  })[];
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<SearchResultItem[]>(items);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);


  const setItemElement = (i: number, el: HTMLDivElement) => {
    itemElements[i] = el;
  };

  const updateDataset = (newIndex: number) => {
    itemElements.forEach((el, i) => {
      if (!el) return;
      el.dataset.selected = i === newIndex ? "true" : "false";
    });
  };

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ["content"], // search in content
        threshold: 0.3, // adjust fuzzy match sensitivity
        includeMatches: true,
      }),
    [items]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (!debouncedQuery) {
      setFilteredItems(items);
    } else {
      const results = fuse.search(debouncedQuery);
      const filteredItemsWithMatches = results.map((r) => ({
        ...r.item,
        matches: r.matches,
      }));
      setFilteredItems(filteredItemsWithMatches);
    }

    setActiveIndex(0);
  }, [debouncedQuery, items, fuse]);

  useEffect(() => {
    updateDataset(activeIndex);
  }, []);

  // keyboard navigation
  useEffect(() => {
    const handle = async (e: KeyboardEvent) => {
      let newIndex = activeIndex;

      if (e.key === "ArrowDown")
        newIndex = Math.min(newIndex + 1, filteredItems.length - 1);
      if (e.key === "ArrowUp") newIndex = Math.max(newIndex - 1, 0);
      if (e.key === "Enter") {
        const item = filteredItems[activeIndex];
        if (item && item.type === "text") {
          writeText(item.content);
          toast.success("Copied to clipboard!");
          invoke("auto_paste").catch(() => {
            toast.error("Unable to auto paste. Check permissions!", {
              action: {
                label: "Settings",
                onClick: () => {
                  invoke("open_system_settings").catch(() =>
                    toast.error("Cannot open system settings")
                  );
                },
              },
            });
          });
        }
      }

      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
        updateDataset(newIndex);

        const el = itemElements[newIndex];
        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    };

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [activeIndex, filteredItems]);

  if (!items[activeIndex]) {
    return <Empty />;
  }

  function renderHighlightedContent(item: SearchResultItem) {
    if (!item?.matches || !item?.matches?.length) return item?.content;

    const match = item.matches.find((m) => m.key === "content");
    if (!match) return item.content;

    let lastIndex = 0;
    const parts = [];

    match.indices.forEach(([start, end], i) => {
      if (start > lastIndex) {
        parts.push(item.content.slice(lastIndex, start));
      }
      parts.push(
        <span key={i} className="bg-yellow-200 text-black">
          {item.content.slice(start, end + 1)}
        </span>
      );
      lastIndex = end + 1;
    });

    if (lastIndex < item.content.length) {
      parts.push(item.content.slice(lastIndex));
    }

    return <>{parts}</>;
  }

  return (
    <div className="flex flex-1 min-h-0">
      <AnimatePresence mode="wait">
        <AnimatedPage id={APP_ID} classname="flex flex-1 flex-col min-w-0">
          <div className="flex flex-1 min-h-0 min-w-0">
            <ClipboardList
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              filteredItems={filteredItems}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setItemElement={setItemElement}
              updateDataset={updateDataset}
            />

            <div className="h-full w-px bg-border" />

            <div className="flex flex-1 flex-col min-w-0 min-h-0">
              <div className="flex flex-1 p-4 min-h-0 min-w-0">
                <div className="flex flex-1 p-4 min-w-0 min-h-0 border rounded-md">
                  <div className="flex flex-1 overflow-y-scroll h-full">
                    <pre>
                      {renderHighlightedContent(filteredItems[activeIndex])}
                    </pre>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex gap-1 flex-col p-4">
                <div className="flex justify-between overflow-hidden">
                  <p>copied:</p>
                  <p className="truncate">
                    {items[activeIndex]?.count
                      ? `${items[activeIndex]?.count}`
                      : ""}
                  </p>
                </div>
                <div className="flex justify-between overflow-hidden">
                  <p>Date:</p>
                  <p className="truncate">{items[activeIndex]?.createdAt}</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedPage>
      </AnimatePresence>
    </div>
  );
}
