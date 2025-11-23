import { useHotkeys } from "react-hotkeys-hook";

import { interval, Mode, PreviewState } from "../constants";
import { isDesktopApp } from "@/utils/is-desktop-mode";
import { useContext } from "react";
import { ProjectContext } from "../../screens/components/project-context";
import { useStore } from "../../state/state";

export const useShortcutKeys = () => {
  const { id: projectId } = useContext(ProjectContext);
  const mode = useStore((state) => state.projectDetail[projectId].mode);
  const addSlide = useStore((state) => state.addSlide);
  const duplicateSlide = useStore((state) => state.duplicateSlide);
  const previewPreviousSlide = useStore((state) => state.previewPreviousSlide);
  const previewNextSlide = useStore((state) => state.previewNextSlide);
  const setPreviewState = useStore((state) => state.setPreviewState);
  const getPreviewState = useStore((state) => state.getPreviewState);
  const setPreviewSlideIdx = useStore((state) => state.setPreviewSlideIdx);
  const setPreviewSize = useStore((state) => state.setPreviewSize);
  const setMode = useStore((state) => state.setMode);

  useHotkeys(
    isDesktopApp ? "mod+d" : "mod+shift+d", // (cmd / ctrl) + (shift) + d
    (event) => {
      event.preventDefault(); // prevent browser default actions
      duplicateSlide(projectId);
    },
    { enableOnFormTags: true, enabled: true, enableOnContentEditable: true },
  );

  useHotkeys(
    isDesktopApp ? "mod+n" : "mod+alt+n", // (cmd / ctrl) + (option / alt) + n
    (event) => {
      event.preventDefault(); // prevent browser default actions
      addSlide(projectId);
    },
    { enableOnFormTags: true, enabled: true, enableOnContentEditable: true },
  );

  useHotkeys(
    "ArrowLeft",
    () => {
      previewPreviousSlide(projectId);
    },
    { enabled: mode === Mode.Preview },
  );

  useHotkeys(
    "ArrowRight",
    () => {
      previewNextSlide(projectId);
    },
    { enabled: mode === Mode.Preview },
  );

  useHotkeys(
    "Space",
    () => {
      const previewState = getPreviewState(projectId);
      switch (previewState) {
        case PreviewState.PAUSE:
        case PreviewState.IDLE: {
          setPreviewState(projectId, PreviewState.PLAY);
          break;
        }
        case PreviewState.FINISH: {
          setPreviewState(projectId, PreviewState.PLAY);
          setPreviewSlideIdx(projectId, 0);
          break;
        }

        case PreviewState.RESUME:
        case PreviewState.PLAY: {
          setPreviewState(projectId, PreviewState.PAUSE);
          break;
        }
        default:
          break;
      }
    },
    { enabled: mode === Mode.Preview, enableOnFormTags: true },
  );

  useHotkeys(
    "Escape",
    () => {
      setPreviewSize(projectId, 100);
      setMode(projectId, Mode.Edit);

      if (interval.previewAnimationInterval) {
        clearInterval(interval.previewAnimationInterval);
        interval.previewAnimationInterval = null;
      }
    },
    { enabled: mode === Mode.Preview, enableOnFormTags: true },
  );

  useHotkeys("mod+enter, F5", () => setMode(projectId, Mode.Preview), {
    enableOnFormTags: true,
  });
};
