import { useMemo, useRef } from "react";
import Fuse from "fuse.js";

import { useBookmarkStore } from "@/mini-apps/bookmark-manager/state/state";
import { SearchInputToolbarItem } from "./search-input-toolbar-item";
import { FolderForm } from "../folder-form";

export const BookmarkManagerRightToolbar = () => {
  return (
    <div
      className="flex flex-1 overflow-auto scrollbar-hidden items-center justify-end h-12 max-h-12"
      data-tauri-drag-region
    >
      <FolderForm />
      <SearchInput />
    </div>
  );
};

export const SearchInput = () => {
  const searchFolderQuery = useBookmarkStore((s) => s.searchFolderQuery);
  const setSearchFolderQuery = useBookmarkStore((s) => s.setSearchFolderQuery);
  const setSearchFolderResult = useBookmarkStore(
    (s) => s.setSearchFolderResult
  );

  const folders = useBookmarkStore((s) => s.folders);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const fuse = useMemo(
    () =>
      new Fuse(folders, {
        keys: ["name"],
        threshold: 0.3,
        includeMatches: true,
      }),
    [folders]
  );

  return (
    <SearchInputToolbarItem
      value={searchFolderQuery}
      onChangeText={(t) => {
        setSearchFolderQuery(t);

        if (timeout.current) {
          clearTimeout(timeout.current);
        }

        timeout.current = setTimeout(() => {
          const results = fuse.search(t);
          const filteredItemsWithMatches = results.map((r) => ({
            ...r.item,
            matches: r.matches,
          }));

          setSearchFolderResult(filteredItemsWithMatches);
        }, 250);
      }}
    />
  );
};
