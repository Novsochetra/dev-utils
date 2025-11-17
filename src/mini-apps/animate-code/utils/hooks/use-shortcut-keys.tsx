import { useHotkeys } from "react-hotkeys-hook";

import { AppActions } from "../../state/actions";
import { AppState, store } from "../../state/state";
import { interval, Mode, PreviewState } from "../constants";
import { useAtomValue } from "jotai";
import { isDesktopApp } from "@/utils/is-desktop-mode";
import { useContext } from "react";
import { ProjectContext } from "../../screens/components/project-context";

export const useShortcutKeys = () => {
  const { id: projectId } = useContext(ProjectContext);
  const mode = useAtomValue(AppState.projectDetail[projectId].mode);

  useHotkeys(
    isDesktopApp ? "mod+d" : "mod+shift+d", // (cmd / ctrl) + (shift) + d
    (event) => {
      event.preventDefault(); // prevent browser default actions
      AppActions.DuplicateSlide(projectId);
    },
    { enableOnFormTags: true, enabled: true, enableOnContentEditable: true },
  );

  useHotkeys(
    isDesktopApp ? "mod+n" : "mod+alt+n", // (cmd / ctrl) + (option / alt) + n
    (event) => {
      event.preventDefault(); // prevent browser default actions
      AppActions.AddSlide(projectId);
    },
    { enableOnFormTags: true, enabled: true, enableOnContentEditable: true },
  );

  useHotkeys(
    "ArrowLeft",
    () => {
      AppActions.PreviewPreviousSlide(projectId);
    },
    { enabled: mode === Mode.Preview },
  );

  useHotkeys(
    "ArrowRight",
    () => {
      AppActions.PreviewNextSlide(projectId);
    },
    { enabled: mode === Mode.Preview },
  );

  useHotkeys(
    "Space",
    () => {
      const previewState = store.get(
        AppState.projectDetail[projectId].previewState,
      );
      switch (previewState) {
        case PreviewState.PAUSE:
        case PreviewState.IDLE: {
          AppActions.SetPreviewState(projectId, PreviewState.PLAY);
          break;
        }
        case PreviewState.FINISH: {
          AppActions.SetPreviewState(projectId, PreviewState.PLAY);
          AppActions.SetPreviewSlideIdx(projectId, 0);
          break;
        }

        case PreviewState.RESUME:
        case PreviewState.PLAY: {
          AppActions.SetPreviewState(projectId, PreviewState.PAUSE);
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
      AppActions.SetPreviewSize(projectId, 100);
      AppActions.SetMode(projectId, Mode.Edit);

      if (interval.previewAnimationInterval) {
        clearInterval(interval.previewAnimationInterval);
        interval.previewAnimationInterval = null;
      }
    },
    { enabled: mode === Mode.Preview, enableOnFormTags: true },
  );

  useHotkeys(
    "mod+enter, F5",
    () => AppActions.SetMode(projectId, Mode.Preview),
    {
      enableOnFormTags: true,
    },
  );
};
