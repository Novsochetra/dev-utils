import { useMemo, useRef } from "react";

import {
  useBookmarkStore,
} from "@/mini-apps/bookmark-manager/state/state";
import { BookmarkForm } from "../bookmark-form";
import { SearchInputToolbarItem } from "./search-input-toolbar-item";
import { useParams } from "react-router";
import Fuse from "fuse.js";

export const BookmarkManagerDetailRightToolbar = () => {
  return (
    <div
      className="flex flex-1 overflow-auto scrollbar-hidden justify-end items-center"
      data-tauri-drag-region
    >
      <BookmarkForm />

      <SearchInput />
    </div>
  );
};

export const SearchInput = () => {
  const searchQuery = useBookmarkStore((s) => s.searchBookmarkQuery);
  const setSearchQuery = useBookmarkStore((s) => s.setSearchBookmarkQuery);
  const setSearchBookmarkResult = useBookmarkStore(
    (s) => s.setSearchBookmarkResult
  );
  const params = useParams();

  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const bookmarkByFolder = useMemo(() => {
    return bookmarks.filter((f) => f.folderId === params["id"]);
  }, [bookmarks]);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const fuse = useMemo(
    () =>
      new Fuse(bookmarkByFolder, {
        keys: ["name", "url", "description"],
        threshold: 0.3,
        includeMatches: true,
      }),
    [bookmarkByFolder]
  );

  return (
    <SearchInputToolbarItem
      value={searchQuery}
      onChangeText={(t) => {
        setSearchQuery(t);

        if (timeout.current) {
          clearTimeout(timeout.current);
        }

        timeout.current = setTimeout(() => {
          const results = fuse.search(t);
          const filteredItemsWithMatches = results.map((r) => ({
            ...r.item,
            matches: r.matches,
          }));

          setSearchBookmarkResult(filteredItemsWithMatches);
        }, 250);
      }}
    />
  );
};
