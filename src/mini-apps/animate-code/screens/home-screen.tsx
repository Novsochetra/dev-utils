import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useAtomValue } from "jotai";

import { AnimatedPage } from "@/vendor/components/animate-page";
import { Navbar } from "@/vendor/components/navbar";

import { APP_ID, interval, Mode } from "../utils/constants";
import { MenuBarItem } from "./components/menu-bar-item";
import { Preview } from "./components/preview";
import { Slider } from "./slider";
import { AppState } from "../state/state";
import { useShortcutKeys } from "../utils/hooks/use-shortcut-keys";
import { CommandMenu } from "./components/command-menu";
import FeedbackWidget from "./components/feedback-widget";

export const AnimateCodeHomeScreen = () => {
  const mode = useAtomValue(AppState.mode);
  const codeEditorRef = useRef<HTMLDivElement | null>(null);

  useShortcutKeys();

  useEffect(() => {
    return () => {
      if (interval.previewAnimationInterval) {
        clearInterval(interval.previewAnimationInterval);
      }
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <AnimatedPage id={APP_ID}>
        <div className="h-dvh w-full flex flex-col overscroll-none">
          <Navbar
            showBack
            title="🤩"
            showSearchBar={false}
            enableBackListener={mode === Mode.Edit}
            enableBackOnFormTags
          />
          <div className="flex flex-1 flex-col px-8 py-4 min-h-0">
            <MenuBarItem />

            <div className="flex w-full rounded-xl bg-white border overflow-hidden">
              <AnimatePresence>
                <Slider codeEditorRef={codeEditorRef} />

                {mode === Mode.Preview && <Preview key={`preview`} />}
              </AnimatePresence>
            </div>
          </div>
          <CommandMenu />

          <FeedbackWidget />
        </div>
      </AnimatedPage>
    </AnimatePresence>
  );
};

export default AnimateCodeHomeScreen;
