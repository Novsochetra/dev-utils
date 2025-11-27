import { useEffect, useState, useTransition } from "react";
import { AnimatePresence } from "framer-motion";

import { AnimatedPage } from "@/vendor/components/animate-page";
import { Navbar } from "@/vendor/components/navbar";

import { APP_ID } from "../utils/constants";
import { ListProject } from "./components/list-project";
import { defaultPersistEngine } from "@/vendor/zustand/persist";

export const AnimateCodeHomeScreen = () => {
  return (
    <AnimatePresence mode="wait">
      <AnimatedPage id={APP_ID}>
        <div className="h-dvh w-full flex flex-col overscroll-none">
          <Navbar
            showBack
            title="🤩"
            showSearchBar={false}
            enableBackOnFormTags
            enableBackListener
          />
          <div className="flex flex-1 flex-col px-8 py-4 min-h-0 overflow-auto">
            <ListProjectWithDelayLayout />
          </div>
        </div>
      </AnimatedPage>
    </AnimatePresence>
  );
};

const ListProjectWithDelayLayout = () => {
  const [isReady, setIsReady] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      if (defaultPersistEngine.isHydrated) {
        setIsReady(true);
      } else {
        defaultPersistEngine.onHydrationCompleted(() => setIsReady(true));
      }
    });
  }, []);

  if (!isReady) {
    return null;
  }

  return <ListProject />;
};

export default AnimateCodeHomeScreen;
