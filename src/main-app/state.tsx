import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, type StateCreatorParams } from "@/vendor/zustand/persist";
import { PersistEngine } from "@/vendor/zustand/persist-engine";
import { LocalStorage } from "@/vendor/zustand/local-storage";

export type Store = {
  sidebarVisible: boolean;

  // actions
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
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
  "sidebarVisible" | "toggleSidebar" | "closeSidebar" | "openSidebar"
> = immer((...args) => {
  const [set] = args;

  return {
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
