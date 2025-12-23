import { useEffect, useRef, useState, type Dispatch } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router";
import { useHotkeys } from "react-hotkeys-hook";
import { List, type RowComponentProps } from "react-window";
import { openUrl } from "@tauri-apps/plugin-opener";

import { useAppStore } from "@/main-app/state";
import { AnimatedPage } from "@/vendor/components/animate-page";
import { BookmarkManagerDetailLeftToolbar } from "./components/toolbar/bookmark-manager-detail-left-toolbar";
import { BookmarkManagerDetailRightToolbar } from "./components/toolbar/bookmark-manager-detail-right-toolbar";
import { APP_ID } from "../utils/constants";
import {
  BookmarkListItem,
  type BookmarkListItemProps,
} from "./components/list-bookmark-item";
import { Empty } from "./components/empty";
import { useBookmarkStore, type BookmarkItem } from "../state/state";
import { toast } from "sonner";
import { EmptySearch } from "./components/empty-search";

export const BookmarkDetailScreen = () => {
  const setLeftMenubar = useAppStore((state) => state.setLeftMenubar);
  const setRightMenubar = useAppStore((state) => state.setRightMenubar);
  const setSearchBookmarkQuery = useBookmarkStore(state => state.setSearchBookmarkQuery)
  const setSearchBookmarkResult = useBookmarkStore(state => state.setSearchBookmarkResult)

  const navigate = useNavigate();

  useHotkeys("Escape", (e) => {
    navigate(-1);
    e.stopPropagation();
  });



  useEffect(() => {
    setLeftMenubar(<BookmarkManagerDetailLeftToolbar />);

    setRightMenubar(<BookmarkManagerDetailRightToolbar />);

    return () => {
      setRightMenubar(null);
      setLeftMenubar(null);

      setSearchBookmarkQuery("")
      setSearchBookmarkResult([])
    };
  }, []);

  return (
    <div className="flex flex-1 min-h-0 overflow-auto">
      <AnimatePresence mode="wait">
        <AnimatedPage id={APP_ID} classname="flex flex-1 flex-col min-w-0">
          <div className="h-full w-full flex flex-1 overscroll-none">
            <BookmarkList />
          </div>
        </AnimatedPage>
      </AnimatePresence>
    </div>
  );
};

export const BookmarkList = () => {
  const params = useParams();
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const bookmarkByFolders = bookmarks.filter(
    (b) => b.folderId === params["id"]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const searchQuery = useBookmarkStore((s) => s.searchBookmarkQuery);

  const filteredItems = useBookmarkStore((s) => s.searchBookmarkResult);
  const items = searchQuery ? filteredItems : bookmarkByFolders;

  const itemElements = useRef<HTMLDivElement[]>([]);

  useHotkeys(
    "Enter",
    (e) => {
      if (e.key === "Enter") {
        const item = items[activeIndex];
        if (item?.url) {
          openUrl(item?.url);
        } else {
          toast.error("URL not found");
        }
      }
    },
    { enabled: true }
  );

  useHotkeys(
    ["ArrowDown", "ArrowUp"],
    (e) => {
      let newIndex = activeIndex;

      if (e.key === "ArrowDown")
        newIndex = Math.min(newIndex + 1, items.length - 1);
      if (e.key === "ArrowUp") newIndex = Math.max(newIndex - 1, 0);

      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);

        const el = itemElements.current[newIndex];
        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
      e.stopPropagation();
      e.preventDefault();
    },
    { enabled: true, enableOnFormTags: true },
    [activeIndex, items]
  );

  const setItemElement = (i: number, el: HTMLDivElement) => {
    itemElements.current[i] = el;
  };

  if (searchQuery && !filteredItems.length) {
    return <EmptySearch />
  }

  if (!bookmarkByFolders.length) {
    return <Empty />;
  }

  return (
    <div className="flex flex-row flex-1 relative h-full">
      <div className="flex flex-1 min-h-0 min-w-0 max-w-80 p-4">
        <List
          rowComponent={RowComponent}
          rowCount={items.length}
          rowHeight={36}
          rowProps={{
            bookmarks: items,
            onSelect: setItemElement,
            activeIndex,
            setActiveIndex,
          }}
        />
      </div>
      <div className="bg-border w-px h-full" />

      <div className="flex flex-1 min-h-0 min-w-0 p-4">
        <p>{items[activeIndex]?.url}</p>
      </div>
    </div>
  );
};

function RowComponent({
  index,
  bookmarks,
  style,
  onSelect,
  activeIndex,
  setActiveIndex,
}: RowComponentProps<{
  bookmarks: BookmarkItem[];
  onSelect: BookmarkListItemProps["onSelect"];
  activeIndex: number;
  setActiveIndex: Dispatch<React.SetStateAction<number>>;
}>) {
  return (
    <div style={style} className="h-9">
      <BookmarkListItem
        item={bookmarks[index]}
        index={index}
        isActive={activeIndex === index}
        onSelect={onSelect}
        setActiveIndex={setActiveIndex}
      />
    </div>
  );
}

export default BookmarkDetailScreen;
