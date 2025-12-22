import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, type StateCreatorParams } from "@/vendor/zustand/persist";
import { PersistEngine } from "@/vendor/zustand/persist-engine";
import { LocalStorage } from "@/vendor/zustand/local-storage";
import type { ReactNode } from "react";

export type Store = {
  sidebarVisible: boolean;
  menubar: {
    left: ReactNode | null,
    center: ReactNode | null
    right: ReactNode | null,
  },

  // actions
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;

  setLeftMenubar: (node: ReactNode) => void;
  setCenterMenubar: (node: ReactNode) => void;
  setRightMenubar: (node: ReactNode) => void;
};

export const appStateLocalStorageEngine = new PersistEngine({
  skipHydration: false,
  adapter: LocalStorage,
  storageKeys: [
    "dev-utils::app-state::sidebar::visible-1",
    "dev-utils::app-state::sidebar::visible",
  ] as const
});

const appSlice: (
  ...args: StateCreatorParams<Store>
) => Pick<
  Store,
  "sidebarVisible" | "toggleSidebar" | "closeSidebar" | "openSidebar" | 'menubar' | 'setLeftMenubar' | 'setRightMenubar' | 'setCenterMenubar'
> = immer((...args) => {
  const [set] = args;

  return {

    menubar: {
      left: null,
      right: null,
      center: null,
    },

    setLeftMenubar(node) {
      set(state => {
        state.menubar.left = node
      })
    },

    setCenterMenubar(node) {
      set(state => {
        state.menubar.center = node
      })
    },

    setRightMenubar(node) {
      set(state => {
        state.menubar.right = node
      })
    },

    sidebarVisible1: persist(true, {
      name: 'dev-utils::app-state::sidebar::visible-1',
      path: "sidebarVisible1",
      engine: appStateLocalStorageEngine,
    })(...args),

    sidebarVisible: persist(true, {
      name: "dev-utils::app-state::sidebar::visible",
      path: "sidebarVisible",
      engine: appStateLocalStorageEngine,
    })(...args),

    toggleSidebar() {
      set((state) => {
        state.sidebarVisible = !state.sidebarVisible;
      });
    },

    openSidebar() {
      set((state) => {
        state.sidebarVisible = true;
      });
    },

    closeSidebar() {
      set((state) => {
        state.sidebarVisible = false;
      });
    },

    
  };
});


export const useAppStore = create<Store>()((...args) => ({
  ...appSlice(...args),
}));
