import { useHotkeys } from "react-hotkeys-hook";

import { AppActions } from "../../state/actions";
import { AppState, store } from "../../state/state";
import { interval, Mode, PreviewState } from "../constants";
import { useAtomValue } from "jotai";

export const useShortcutKeys = () => {
  const mode = useAtomValue(AppState.mode);

  useHotkeys(
    "mod+alt+n", // (cmd / ctrl) + (option / alt) + n
    (event) => {
      event.preventDefault(); // prevent browser default actions
      AppActions.AddSlide();
    },
    { enableOnFormTags: true, enabled: true, enableOnContentEditable: true },
  );

  useHotkeys(
    "ArrowLeft",
    () => {
      AppActions.PreviewPreviousSlide();
    },
    { enabled: mode === Mode.Preview },
  );

  useHotkeys(
    "ArrowRight",
    () => {
      AppActions.PreviewNextSlide();
    },
    { enabled: mode === Mode.Preview },
  );

  useHotkeys(
    "Space",
    () => {
      const previewState = store.get(AppState.previewState);
      switch (previewState) {
        case PreviewState.PAUSE:
        case PreviewState.IDLE: {
          AppActions.SetPreviewState(PreviewState.PLAY);
          break;
        }
        case PreviewState.FINISH: {
          AppActions.SetPreviewState(PreviewState.PLAY);
          AppActions.SetPreviewSlideIdx(0);
          break;
        }

        case PreviewState.RESUME:
        case PreviewState.PLAY: {
          AppActions.SetPreviewState(PreviewState.PAUSE);
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
      AppActions.SetPreviewSize(100);
      AppActions.SetMode(Mode.Edit);

      if (interval.previewAnimationInterval) {
        clearInterval(interval.previewAnimationInterval);
        interval.previewAnimationInterval = null;
      }
    },
    { enabled: mode === Mode.Preview, enableOnFormTags: true },
  );

  useHotkeys("mod+enter, F5", () => AppActions.SetMode(Mode.Preview), {
    enableOnFormTags: true,
  });
};
