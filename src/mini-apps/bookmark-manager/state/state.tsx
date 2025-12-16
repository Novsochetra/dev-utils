import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { IndexDBStorage } from "@/vendor/zustand/index-db";
import { persist } from "@/vendor/zustand/persist";
import { PersistEngine } from "@/vendor/zustand/persist-engine";
import { v4 } from "uuid";

export type BookmarkItem = {
  id: string;
  icon: string;
  url: string;
  name: string;
  createdAt: number;
  folderId: string;
};

export type Folder = {
  name: string;
  id: string;
  createdAt: number;
};

type Store = {
  folders: Folder[];
  bookmarks: BookmarkItem[];

  addFolder: (name: Folder["name"]) => void;
  removeFolder: (id: Folder["id"]) => void;
  renameFolder: (id: Folder["id"], name: Folder["name"]) => void;

  addBookmark: (params: Pick<BookmarkItem, "icon" | "url" | "name" | "folderId">) => void;
  removeBookmark: (id: BookmarkItem["id"]) => void;
  updateBookmark: (
    id: BookmarkItem["id"],
    newFields: Partial<Pick<BookmarkItem, "icon" | "name" | "url">>
  ) => void;
};

const bookmarkPersistEngine = new PersistEngine({
  storageKeys: [
    "dev-utils::bookmark-manager::data",
    "dev-utils::bookmark-manager::bookmarks",
  ],
  adapter: IndexDBStorage,
});

export const useBookmarkStore = create<Store>()(
  immer((...args) => {
    const [set] = args;
    return {
      folders: persist([], {
        name: "dev-utils::bookmark-manager::folders",
        path: "folders",
        engine: bookmarkPersistEngine,
      })(...args),

      addFolder(name) {
        set((state) => {
          const folder: Folder = {
            name,
            id: v4(),
            createdAt: Date.now(),
          };

          state.folders.unshift(folder);
        });
      },

      removeFolder(id) {
        set((state) => {
          const foundIdx = state.folders.findIndex((s) => s.id === id);

          if (foundIdx !== -1) {
            state.folders.splice(foundIdx, 1);
          }

          state.bookmarks = state.bookmarks.filter(v => v.folderId === id)
        });

      },

      renameFolder(id, name) {
        set((state) => {
          const foundIdx = state.folders.findIndex((s) => s.id === id);

          if (foundIdx !== -1) {
            state.folders[foundIdx].name = name;
          }
        });
      },

      bookmarks: persist([], {
        name: "dev-utils::bookmark-manager::bookmarks",
        path: "bookmarks",
        engine: bookmarkPersistEngine,
      })(...args),

      addBookmark(params) {
        set((state) => {
          const bookmark: BookmarkItem = {
            id: v4(),
            ...params,
            createdAt: Date.now(),
          };

          state.bookmarks.unshift(bookmark);
        });
      },

      removeBookmark(id) {
        set(state => {
          const foundIdx = state.bookmarks.findIndex((s) => s.id === id);

          if (foundIdx !== -1) {
            state.bookmarks.splice(foundIdx, 1)
          }
        })
      },

      updateBookmark(id, newFields) {
        set(state => {
          const foundIdx = state.bookmarks.findIndex((s) => s.id === id);

          if(foundIdx !== -1) {
            state.bookmarks[foundIdx] = {
              ...state.bookmarks[foundIdx],
              ...newFields
            }
          }
        })
      },
    };
  })
);
