import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { onTextUpdate, startListening } from "tauri-plugin-clipboard-api";
import { v4 } from "uuid";
import { create } from "zustand";

export type ClipItem = {
  id: string;
  type: "text" | "image";
  content: string; // text or base64 image
  pinned: boolean;
  createdAt: string;
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
  addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
  clearHistory: () => set({ items: [] }),
  togglePin: (id) =>
    set((state) => ({
      items: state.items.map((it) =>
        it.id === id ? { ...it, pinned: !it.pinned } : it
      ),
    })),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((it) => it.id !== id) })),
}));

let listener: UnlistenFn | null = null;

async function startListenClipboard() {
  try {
    // 1. Start the Rust background listener
    await startListening();

    // 2. Subscribe to updates
    listener = await onTextUpdate((text) => {
      useClipboardStore.getState().addItem({
        id: v4(),
        type: "text",
        content: text,
        pinned: false,
        createdAt: new Date().toLocaleDateString()
      })
    });
  } catch (error) {
    console.error("Failed to start clipboard listener:", error);
  }
}

if(!listener) {
  startListenClipboard();
}

