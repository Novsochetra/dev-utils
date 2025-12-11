// clipboardStore.ts
import { UTCDate } from "@date-fns/utc";
import { type UnlistenFn } from "@tauri-apps/api/event";
import { format } from "date-fns";
import { onTextUpdate, startListening } from "tauri-plugin-clipboard-api";
import { v4 } from "uuid";
import { create } from "zustand";

export type ClipItem = {
  id: string;
  type: "text" | "image";
  content: string;        // text or base64
  pinned: boolean;
  createdAt: string;
  count: number;          // number of times copied
};

type State = {
  items: ClipItem[];
  addItem: (item: ClipItem) => void;
  clearHistory: () => void;
  togglePin: (id: string) => void;
  removeItem: (id: string) => void;
};

export const useClipboardStore = create<State>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((it) => it.content === item.content);

      // If exists → increase count & move to top
      if (existing) {
        return {
          items: [
            { ...existing, count: existing.count + 1 },
            ...state.items.filter((it) => it.id !== existing.id),
          ],
        };
      }

      // New item → add to top
      return {
        items: [
          { ...item, count: 1 },
          ...state.items,
        ],
      };
    }),

  clearHistory: () => set({ items: [] }),

  togglePin: (id) =>
    set((state) => {
      const updated = state.items.map((it) =>
        it.id === id ? { ...it, pinned: !it.pinned } : it
      );

      // Keep pinned items at the top
      updated.sort((a, b) => Number(b.pinned) - Number(a.pinned));

      return { items: updated };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((it) => it.id !== id),
    })),
}));

// -------------------------
// Tauri clipboard listener
// -------------------------
let listener: UnlistenFn | null = null;

export async function startListenClipboard() {
  try {
    await startListening();

    listener = await onTextUpdate((text) => {
      useClipboardStore.getState().addItem({
        id: v4(),
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

if (!listener) startListenClipboard();