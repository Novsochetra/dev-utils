import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, type StateCreatorParams } from "@/vendor/zustand/persist";

export type Store = {
  sidebarVisible: boolean;

  // actions
  toggleSidebar: () => void;
};

const appSlice: (
  ...args: StateCreatorParams<Store>
) => Pick<Store, "sidebarVisible" | "toggleSidebar"> = immer((...args) => {
  const [set] = args;

  return {
    sidebarVisible: persist(true, {
      name: "dev-utils::app-state::sidebar::visible",
      path: "sidebarVisible",
    })(...args),

    toggleSidebar() {
      set((state) => {
        state.sidebarVisible = !state.sidebarVisible;
      });
    },
  };
});

export const useAppStore = create<Store>()((...args) => ({
  ...appSlice(...args),
}));
