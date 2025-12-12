import { UTCDate } from "@date-fns/utc";
import { type UnlistenFn } from "@tauri-apps/api/event";
import { format } from "date-fns";
import { onTextUpdate, startListening } from "tauri-plugin-clipboard-api";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { invoke } from "@tauri-apps/api/core";

import { isDesktopApp } from "@/utils/is-desktop-mode";
import { IndexDBStorage } from "@/vendor/zustand/index-db";
import { persist } from "@/vendor/zustand/persist";
import { PersistEngine } from "@/vendor/zustand/persist-engine";

export type ClipItem = {
  id: string;
  type: "text" | "image";
  content: string; // text or base64
  pinned: boolean;
  createdAt: string;
  count: number; // number of times copied
};

type Store = {
  items: ClipItem[];
  addItem: (item: ClipItem) => void;
  clearHistory: () => void;
  removeItem: (id: string) => void;
};

const clipboardPersistEngine = new PersistEngine({
  storageKeys: ["dev-utils::clipboard-history::data"],
  adapter: IndexDBStorage,
});

export const useClipboardStore = create<Store>()(
  immer((...args) => {
    const [set] = args;

    return {
      items: persist([], {
        name: "dev-utils::clipboard-history::data",
        path: "items",
        engine: clipboardPersistEngine,
      })(...args),

      addItem: async (item) => {
        set((state) => {
          if(!item.content?.trim()) {
            return state;
          }

          const existing = state.items.findIndex(
            (it) => it.id === item.id
          );

          // If exists → increase count & move to top
          if (existing !== -1) {
            const clone = state.items[existing];
            state.items.splice(existing, 1);
            state.items.unshift({
              ...clone,
              count: clone.count + 1
            });
          } else {
            // New item → add to top
            state.items.unshift({ ...item, count: 1 })
          }

          return state;
        })
      },

      clearHistory: () => {
        set(state => {
          state.items = []
          return state
        })
      },

      removeItem: (id) =>
        set((state) => {
          const foundIdx = state.items.findIndex(v => v.id = id)

          if(foundIdx !== -1 ) {
            state.items.splice(foundIdx, 1)
          }

          return state
        }),
    };
  })
);

// -------------------------
// Tauri clipboard listener
// -------------------------
let listener: UnlistenFn | null = null;

export async function startListenClipboard() {
  try {
    await startListening();

    listener = await onTextUpdate(async (text) => {
      const hashed = await invoke('get_content_hash', {content: text}) as string

      useClipboardStore.getState().addItem({
        id: hashed,
        type: "text",
        content: text,
        pinned: false,
        createdAt: format(new UTCDate(), "EEE dd MMM yyyy HH:mm:ss"),
        count: 1,
      });
    });
  } catch (error) {
    console.error("Failed to start clipboard listener:", error);
  }
}

if (!listener && isDesktopApp) startListenClipboard();