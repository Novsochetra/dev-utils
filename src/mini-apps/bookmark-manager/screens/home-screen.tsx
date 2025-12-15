import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { type FuseResultMatch } from "fuse.js";
import { invoke } from "@tauri-apps/api/core";

import { AnimatedPage } from "@/vendor/components/animate-page";
import { APP_ID } from "../utils/constants";

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
          <div className="flex flex-1 min-h-0 min-w-0">
            {iconPath ? <img src={iconPath} className="w-4 h-4" /> : null}
          </div>
        </AnimatedPage>
      </AnimatePresence>
    </div>
  );
}
