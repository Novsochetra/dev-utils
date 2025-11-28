import { useContext, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";

import { AnimatedPage } from "@/vendor/components/animate-page";
import { Navbar } from "@/vendor/components/navbar";

import { APP_ID, APP_NAME, interval, Mode } from "../utils/constants";
import { MenuBarItem } from "./components/menu-bar-item";
import { useStore } from "../state/state";
import { useShortcutKeys } from "../utils/hooks/use-shortcut-keys";
import {
  ProjectContext,
  ProjectContextProvider,
} from "./components/project-context";
import { useParams } from "react-router";
import { CommandMenu } from "./components/command-menu";
import FeedbackWidget from "./components/feedback-widget";
import { Slider } from "./slider";
import { Preview } from "./components/preview";

export const ProjectDetailScreen = () => {
  const params = useParams();

  if (!params.id) {
    return null;
  }

  return (
    <ProjectContextProvider id={params.id as string}>
      <ProjectDetailContent />
    </ProjectContextProvider>
  );
};

const ProjectDetailContent = () => {
  const { id: projectId } = useContext(ProjectContext);
  const mode = useStore((state) => state.projectDetail[projectId].mode);
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
            title={APP_NAME}
            showSearchBar={false}
            enableBackListener={mode === Mode.Edit}
            enableBackOnFormTags
          />
          <div className="flex flex-1 flex-col px-8 py-4 min-h-0">
            <MenuBarItem />

            <div className="flex w-full rounded-xl bg-white border overflow-hidden">
              <Slider codeEditorRef={codeEditorRef} />

              {mode === Mode.Preview && <Preview key={`preview`} />}
            </div>
          </div>
          <CommandMenu />

          <FeedbackWidget />
        </div>
      </AnimatedPage>
    </AnimatePresence>
  );
};

export default ProjectDetailScreen;
