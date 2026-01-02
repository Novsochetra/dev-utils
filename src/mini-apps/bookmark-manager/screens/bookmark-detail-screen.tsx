import { useEffect, useRef, useState, type Dispatch } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router";
import { useHotkeys } from "react-hotkeys-hook";
import { List, type RowComponentProps } from "react-window";
import { openUrl } from "@tauri-apps/plugin-opener";
import { toast } from "sonner";
import { format } from "date-fns";

import { useAppStore } from "@/main-app/state";
import { AnimatedPage } from "@/vendor/components/animate-page";
import { Label } from "@/vendor/shadcn/components/ui/label";
import { Input } from "@/vendor/shadcn/components/ui/input";
import { Textarea } from "@/vendor/shadcn/components/ui/textarea";
import { Separator } from "@/vendor/shadcn/components/ui/separator";
import { BookmarkManagerDetailLeftToolbar } from "./components/toolbar/bookmark-manager-detail-left-toolbar";
import { BookmarkManagerDetailRightToolbar } from "./components/toolbar/bookmark-manager-detail-right-toolbar";
import { APP_ID } from "../utils/constants";
import {
  BookmarkListItem,
  type BookmarkListItemProps,
} from "./components/list-bookmark-item";
import { Empty } from "./components/empty";
import { useBookmarkStore, type BookmarkItem } from "../state/state";
import { EmptySearch } from "./components/empty-search";

export const BookmarkDetailScreen = () => {
  const setLeftMenubar = useAppStore((state) => state.setLeftMenubar);
  const setRightMenubar = useAppStore((state) => state.setRightMenubar);
  const setSearchBookmarkQuery = useBookmarkStore(
    (state) => state.setSearchBookmarkQuery
  );
  const setSearchBookmarkResult = useBookmarkStore(
    (state) => state.setSearchBookmarkResult
  );

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

      setSearchBookmarkQuery("");
      setSearchBookmarkResult([]);
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
    return <EmptySearch />;
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

      <div className="flex flex-col flex-1 min-h-0 min-w-0">
        <div className="flex flex-col gap-4 flex-1 p-4">
          <BookmarkURL activeIndex={activeIndex} url={items[activeIndex].url} />

          <BookmarkDescription
            activeIndex={activeIndex}
            description={items[activeIndex].description}
          />
        </div>
        <Separator />
        <div className="flex gap-1 flex-col p-4">
          <div className="flex justify-between overflow-hidden">
            <p className="text-muted-foreground text-sm">Created At:</p>
            <p className="truncate text-foreground">{format(items[activeIndex]?.createdAt, "EEE dd MMM yyyy HH:mm:ss")}</p>
          </div>
          <div className="flex justify-between overflow-hidden">
            <p className="text-muted-foreground">Updated At:</p>
            <p className="truncate text-foreground">{format(items[activeIndex]?.updatedAt, "EEE dd MMM yyyy HH:mm:ss")}</p>
          </div>
        </div>
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

const BookmarkURL = ({
  activeIndex,
  url,
}: {
  activeIndex: number;
  url: string;
}) => {
  const searchQuery = useBookmarkStore((s) => s.searchBookmarkQuery);
  const updateBookmark = useBookmarkStore((s) => s.updateBookmark);
  const bookmark = useBookmarkStore((s) => s.bookmarks[activeIndex]);

  return (
    <div className="grid gap-3">
      <Label htmlFor="url">URL</Label>
      <Input
        id="url"
        name="url"
        value={searchQuery ? url : bookmark.url}
        disabled={!!searchQuery}
        required
        onChange={(e) => {
          updateBookmark(bookmark.id, { name: e.target.value });
        }}
      />
    </div>
  );
};

const BookmarkDescription = ({
  activeIndex,
  description,
}: {
  activeIndex: number;
  description: string | null;
}) => {
  const searchQuery = useBookmarkStore((s) => s.searchBookmarkQuery);
  const updateBookmark = useBookmarkStore((s) => s.updateBookmark);
  const bookmark = useBookmarkStore((s) => s.bookmarks[activeIndex]);

  return (
    <div className="grid gap-3">
      <Label htmlFor="description">Note</Label>
      <Textarea
        id="description"
        name="description"
        value={(searchQuery ? description : bookmark.description) || ""}
        disabled={!!searchQuery}
        onChange={(e) => {
          updateBookmark(bookmark.id, { description: e.target.value });
        }}
      />
    </div>
  );
};

export default BookmarkDetailScreen;
