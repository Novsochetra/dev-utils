import { useHotkeys } from "react-hotkeys-hook";

import { AppActions } from "../../state/actions";
import { AppState, store } from "../../state/state";
import { interval, Mode, PreviewState } from "../constants";
import { useAtomValue } from "jotai";

export const useShortcutKeys = () => {
  const mode = useAtomValue(AppState.mode);

  useHotkeys(
    "ArrowLeft",
    () => {
      const previewSlideIdx = store.get(AppState.previewSlideIdx) ?? 0;

      if (previewSlideIdx <= 0) {
        AppActions.SetPreviewState(PreviewState.PAUSE);
        return;
      }

      AppActions.SetPreviewState(PreviewState.PAUSE);
      AppActions.SetPreviewSlideIdx(Math.max((previewSlideIdx || 0) - 1, 0));
    },
    { enabled: mode === Mode.Preview },
  );

  useHotkeys(
    "ArrowRight",
    () => {
      const previewSlideIdx = store.get(AppState.previewSlideIdx) ?? 0;
      const slides = store.get(AppState.slides);
      const lastIdx = slides.length - 1;

      const nextIdx = Math.min(previewSlideIdx + 1, slides.length - 1);

      if (nextIdx >= lastIdx) {
        AppActions.SetPreviewState(PreviewState.FINISH);
      } else {
        AppActions.SetPreviewState(PreviewState.PAUSE);
      }

      AppActions.SetPreviewSlideIdx(nextIdx);
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
