import { useEffect, useRef, useState, type Dispatch } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router";
import { useHotkeys } from "react-hotkeys-hook";
import { openUrl } from '@tauri-apps/plugin-opener';
import { List, type RowComponentProps } from "react-window";

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

export const BookmarkDetailScreen = () => {
  const setLeftMenubar = useAppStore((state) => state.setLeftMenubar);
  const setRightMenubar = useAppStore((state) => state.setRightMenubar);
  const navigate = useNavigate();

  useHotkeys(
    "Escape",
    () => {
      navigate(-1);
    },
    { enabled: true, enableOnFormTags: true }
  );

  useEffect(() => {
    setLeftMenubar(<BookmarkManagerDetailLeftToolbar />);

    setRightMenubar(<BookmarkManagerDetailRightToolbar />);

    return () => {
      setRightMenubar(null);
      setLeftMenubar(null);
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<BookmarkItem[]>(bookmarkByFolders);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const itemElements = useRef<HTMLDivElement[]>([]);

  // keyboard navigation
  useEffect(() => {
    const handle = async (e: KeyboardEvent) => {
      let newIndex = activeIndex;

      if (e.key === "ArrowDown")
        newIndex = Math.min(newIndex + 1, filteredItems.length - 1);
      if (e.key === "ArrowUp") newIndex = Math.max(newIndex - 1, 0);
      
      // TODO:
      // if (e.key === "Enter") {
      //   const item = filteredItems[activeIndex];
      //   if(item.url) {
      //     openUrl(item.url)
      //   } else {
      //     toast.error("URL not found")
      //   }
      // }

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
    };

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [activeIndex, filteredItems]);

  const setItemElement = (i: number, el: HTMLDivElement) => {
    itemElements.current[i] = el;
  };

  if (!bookmarkByFolders[activeIndex]) {
    return <Empty />;
  }

  return (
    <div className="flex flex-row flex-1 relative h-full">
      {/* <div className="absolute top-0 left-0 z-10 w-full px-4 pt-4 pb-2">
          <Input
            type="text"
            placeholder="Search clipboard..."
            className="p-2 border rounded-md h-9"
            value={searchQuery}
            autoFocus
            spellCheck="false"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div> */}
      <div className="flex flex-1 min-h-0 min-w-0 max-w-80">
        <List
          // style={{ marginTop: 36 + 16 + 8 }}
          rowComponent={RowComponent}
          rowCount={bookmarkByFolders.length}
          rowHeight={36}
          rowProps={{
            bookmarks: bookmarkByFolders,
            onSelect: setItemElement,
            activeIndex,
            setActiveIndex,
          }}
        />
      </div>

      <div className="flex flex-1 min-h-0 min-w-0 bg-green-500">
        <p>{bookmarkByFolders[activeIndex].url}</p>
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
    <div style={style} className="h-9 border-b">
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
