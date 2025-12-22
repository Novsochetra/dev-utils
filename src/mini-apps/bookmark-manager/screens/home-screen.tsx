import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { type FuseResultMatch } from "fuse.js";
import { invoke } from "@tauri-apps/api/core";

import { AnimatedPage } from "@/vendor/components/animate-page";
import { useAppStore } from "@/main-app/state";
import { BookmarkFolders } from "./components/list-folder";
import { BookmarkManagerRightToolbar } from "./components/toolbar/right-toolbar";
import { BookmarkManagerLeftToolbar } from "./components/toolbar/left-toolbar";
import { APP_ID } from "../utils/constants";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router";

export type SearchResultItem = {
  matches: readonly FuseResultMatch[] | undefined;
  id: string;
  type: "text" | "image";
  content: string;
  pinned: boolean;
  createdAt: string;
  count: number;
};

export default function BookmarkManager() {
  const [iconPath, setIconPath] = useState<string>("");
  const setRightMenubar = useAppStore(state => state.setRightMenubar)
  const setLeftMenubar = useAppStore(state => state.setLeftMenubar)
  const navigate = useNavigate();

  useHotkeys(
    "Escape",
    () => {
     navigate('/')
    },
    { enabled: true, enableOnFormTags: true },
  );
  
  useEffect(() => {
    setRightMenubar(
      <BookmarkManagerRightToolbar />
    )

    setLeftMenubar(<BookmarkManagerLeftToolbar />)

    return () => {
      setRightMenubar(null)
      setLeftMenubar(null)
    }
  }, [])

  useEffect(() => {
    async function saveFavicon(url: string) {
      const fullPath = await invoke("save_favicon", {
        url,
      });
      const base64 = await invoke('get_favicon_base64', {path: fullPath})
      
      setIconPath(`data:image/x-icon;base64,${base64}`);
    }

    const url = "https://www.bbc.com/news/live/ckgk391yzm7t";
    

    saveFavicon(url);
  }, []);

  return (
    <div className="flex flex-1 min-h-0">
      <AnimatePresence mode="wait">
        <AnimatedPage id={APP_ID} classname="flex flex-1 flex-col min-w-0">
          <div className="flex flex-1 flex-col p-4 min-h-0 overflow-auto">
            <BookmarkFolders />
          </div>
        </AnimatedPage>
      </AnimatePresence>
    </div>
  );
}
