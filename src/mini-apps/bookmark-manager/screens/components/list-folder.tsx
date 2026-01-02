import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";

import { isMac } from "@/utils/is-desktop-mode";
import { ListFolderItem } from "./list-folder-item";
import { useBookmarkStore } from "../../state/state";

export const BookmarkFolders = () => {
  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
      initial="hidden"
      animate="show"
      exit="hidden"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.05, // delay between each card
          },
        },
      }}
    >
      <ListFolder />
    </motion.div>
  );
};

export const ListFolder = () => {
  const folders = useBookmarkStore((state) => state.folders);
  const searchFolderQuery = useBookmarkStore(
    (state) => state.searchFolderQuery
  );
  const searchFolderResult = useBookmarkStore(
    (state) => state.searchFolderResult
  );
  const items = searchFolderQuery ? searchFolderResult : folders;
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const navigate = useNavigate();
  const deleteShortcutKey = isMac ? "meta+backspace" : "ctrl+backspace";
  const removeFolder = useBookmarkStore((state) => state.removeFolder);

  useHotkeys(
    deleteShortcutKey,
    (e) => {
      e.stopPropagation();
      e.preventDefault();

      if(selectedIdx !== -1) {
        removeFolder(items[selectedIdx].id);
      }
    },
    { enableOnFormTags: true }
  );

  useHotkeys(
    "Enter",
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (items[selectedIdx].id) {
        navigate(`/bookmark-manager/${items[selectedIdx].id}`);
      }
    },
    { enableOnFormTags: true }
  );

  useHotkeys(
    "ArrowRight",
    () => {
      setSelectedIdx((prev) => {
        if (prev + 1 > items.length - 1) return items.length - 1;

        return prev + 1;
      });
    },
    { enableOnFormTags: true }
  );

  useHotkeys(
    "ArrowLeft",
    () => {
      setSelectedIdx((prev) => {
        if (prev - 1 < 0) return 0;

        return prev - 1;
      });
    },
    { enableOnFormTags: true }
  );

  useHotkeys(
    ["ArrowDown", "ArrowUp"],
    (e) => {
      e.stopPropagation();
      e.preventDefault();

      const currentId = items[selectedIdx]?.id;
      const currentEl = currentId ? refs.current[currentId] : null;
      if (!currentEl) return;

      const currentRect = currentEl.getBoundingClientRect();

      // Find the closest item vertically in the correct direction
      let best: { idx: number; distance: number } | null = null;

      items.forEach((item: any, idx: number) => {
        if (idx === selectedIdx) return;

        const el = refs.current[item.id];
        if (!el) return;

        const rect = el.getBoundingClientRect();

        if (e.key === "ArrowDown" && rect.top > currentRect.bottom) {
          const distance = Math.hypot(
            rect.left - currentRect.left,
            rect.top - currentRect.top
          );
          if (!best || distance < best.distance) best = { idx, distance };
        }

        if (e.key === "ArrowUp" && rect.bottom < currentRect.top) {
          const distance = Math.hypot(
            rect.left - currentRect.left,
            rect.top - currentRect.top
          );
          if (!best || distance < best.distance) best = { idx, distance };
        }
      });

      if (best) {
        setSelectedIdx((best as { idx: number; distance: number }).idx);
      }
    },
    { enableOnFormTags: true }
  );

  return (
    <AnimatePresence>
      {items.map((p, idx) => {
        return (
          <motion.div
            key={p.id}
            tabIndex={-1}
            ref={(el) => {
              refs.current[p.id] = el;
            }}
            layout
            layoutId={`folder-item-${p.id}`}
            variants={{
              hidden: {
                scale: 0.9,
                opacity: 0,
              },
              show: {
                scale: 1,
                opacity: 1,
              },
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
            }}
          >
            <ListFolderItem
              id={p.id}
              isFocus={selectedIdx === idx}
              index={idx}
              name={p.name}
            />
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
};
