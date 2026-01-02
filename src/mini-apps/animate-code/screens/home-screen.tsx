import { useEffect, useState, useTransition } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useHotkeys } from "react-hotkeys-hook";

import { AnimatedPage } from "@/vendor/components/animate-page";
import { defaultPersistEngine } from "@/vendor/zustand/persist";
import { useAppStore } from "@/main-app/state";

import { ListProject } from "./components/list-project";
import { AnimateCodeLeftToolbar } from "./components/toolbar/left-toolbar";
import { APP_ID } from "../utils/constants";
import { animateCodePersistEngine } from "../state/state";

export const AnimateCodeHomeScreen = () => {
  const setRightMenubar = useAppStore((state) => state.setRightMenubar);
  const setLeftMenubar = useAppStore((state) => state.setLeftMenubar);
  const navigate = useNavigate();

  useHotkeys(
    "Escape",
    () => {
      navigate("/");
    },
    { enableOnFormTags: true }
  );

  useEffect(() => {
    setRightMenubar(null);
    setLeftMenubar(<AnimateCodeLeftToolbar />);

    return () => {
      setRightMenubar(null);
      setLeftMenubar(null);
    };
  }, []);
  
  return (
    <div className="flex flex-1 min-h-0 overflow-auto">
      <AnimatePresence mode="wait">
        <AnimatedPage id={APP_ID}>
          <div className="flex flex-1 flex-col px-8 py-4 min-h-0 overflow-auto">
            <ListProjectWithDelayLayout />
          </div>
        </AnimatedPage>
      </AnimatePresence>
    </div>
  );
};

const ListProjectWithDelayLayout = () => {
  const [isReady, setIsReady] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      await animateCodePersistEngine.rehydrate();

      if (defaultPersistEngine.isReady) {
        setIsReady(true);
      } else {
        animateCodePersistEngine.onHydrateCompleted(() => setIsReady(true));
      }
    });
  }, []);

  if (!isReady) {
    return null;
  }

  return <ListProject />;
};

export default AnimateCodeHomeScreen;
