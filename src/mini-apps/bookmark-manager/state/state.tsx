import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { v4 } from "uuid";
import { invoke } from "@tauri-apps/api/core";
import { type FuseResultMatch } from "fuse.js";

import { IndexDBStorage } from "@/vendor/zustand/index-db";
import { persist } from "@/vendor/zustand/persist";
import { PersistEngine } from "@/vendor/zustand/persist-engine";

export type BookmarkItem = {
  id: string;
  icon?: string | null;
  localIconPath?: string | null;
  url: string;
  name: string;
  description: string | null;
  createdAt: number;
  updatedAt: number;
  folderId: string;
};

export type Folder = {
  name: string;
  id: string;
  createdAt: number;
  updatedAt: number;
};

export type Store = {
  // Folder
  folders: Folder[];
  searchFolderQuery: string;
  searchFolderResult: (Folder & {
    matches?: readonly FuseResultMatch[] | undefined
  })[];
  addFolder: (name: Folder["name"]) => void;
  setSearchFolderQuery: (query: string) => void;
  setSearchFolderResult: (result: Store['searchFolderResult']) => void;
  removeFolder: (id: Folder["id"]) => void;
  renameFolder: (id: Folder["id"], name: Folder["name"]) => void;
  
  // Bookmark
  bookmarks: BookmarkItem[];
  searchBookmarkQuery: string;
  searchBookmarkResult: (BookmarkItem & {
    matches?: readonly FuseResultMatch[] | undefined
  })[];
  addBookmark: (
    params: Pick<BookmarkItem, "url" | "name" | "folderId" | "description">
  ) => void;
  removeBookmark: (id: BookmarkItem["id"]) => void;
  updateBookmark: (
    id: BookmarkItem["id"],
    newFields: Partial<Pick<BookmarkItem, "icon" | "name" | "url" | "description">>
  ) => void;
  setSearchBookmarkQuery: (query: string) => void;
  setSearchBookmarkResult: (result: Store["searchBookmarkResult"]) => void;
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
      // Folder
      folders: persist([], {
        name: "dev-utils::bookmark-manager::folders",
        path: "folders",
        engine: bookmarkPersistEngine,
      })(...args),
      searchFolderQuery: "",
      searchFolderResult: [],

      addFolder(name) {
        set((state) => {
          const folder: Folder = {
            name,
            id: v4(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          state.folders.unshift(folder);
        });
      },

      removeFolder(id) {
        set((state) => {
          const foundIdx = state.folders.findIndex((s) => s.id === id);

          if (foundIdx !== -1) {
            state.folders.splice(foundIdx, 1);
            state.bookmarks = state.bookmarks.filter((v) => v.folderId !== id);
          }
        });
      },

      renameFolder(id, name) {
        set((state) => {
          const foundIdx = state.folders.findIndex((s) => s.id === id);

          if (foundIdx !== -1) {
            state.folders[foundIdx].name = name;
            state.folders[foundIdx].updatedAt = Date.now();
          }
        });
      },

      setSearchFolderQuery(query) {
        set((state) => {
          state.searchFolderQuery = query;
        });
      },

      setSearchFolderResult(result) {
        set((state) => {
          // @ts-ignore
          state.searchFolderResult = result;
        });
      },

      // Bookmark
      bookmarks: persist([], {
        name: "dev-utils::bookmark-manager::bookmarks",
        path: "bookmarks",
        engine: bookmarkPersistEngine,
      })(...args),

      searchBookmarkQuery: "",
      searchBookmarkResult: [],

      async addBookmark(params) {
        let icon = null;
        let localIconPath = null;

        try {
          localIconPath = (await invoke("save_favicon", {
            url: params.url,
          })) as string;

          const base64 = await invoke("get_favicon_base64", {
            path: localIconPath,
          });
          icon = `data:image/x-icon;base64,${base64}`;
        } catch (error) {
          icon = null;
          localIconPath = null;
        }

        set((state) => {
          const bookmark: BookmarkItem = {
            id: v4(),
            ...params,
            icon,
            localIconPath: localIconPath,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          state.bookmarks.unshift(bookmark);
        });
      },

      removeBookmark(id) {
        set((state) => {
          const foundIdx = state.bookmarks.findIndex((s) => s.id === id);

          if (foundIdx !== -1) {
            state.bookmarks.splice(foundIdx, 1);
          }
        });
      },

      async updateBookmark(id, newFields) {
        let localIconPath: string | null, icon: string | null;

        try {
          if (newFields.url) {
            localIconPath = (await invoke("save_favicon", {
              url: newFields.url,
            })) as string;

            const base64 = await invoke("get_favicon_base64", {
              path: localIconPath,
            });
            icon = `data:image/x-icon;base64,${base64}`;
          }
        } catch (error) {
          icon = null;
          localIconPath = null;
        }

        set((state) => {
          const foundIdx = state.bookmarks.findIndex((s) => s.id === id);

          if (foundIdx !== -1) {
            state.bookmarks[foundIdx] = {
              ...state.bookmarks[foundIdx],
              ...newFields,
              icon,
              localIconPath,
            };
          }
        });
      },

      setSearchBookmarkQuery(query) {
        set((state) => {
          state.searchBookmarkQuery = query;
        });
      },

      setSearchBookmarkResult(result) {
        set((state) => {
          // @ts-ignore
          state.searchBookmarkResult = result;
        });
      },
    };
  })
);
