import { useHotkeys } from "react-hotkeys-hook";

import { AppActions } from "../../state/actions";
import { AppState, store } from "../../state/state";
import { interval, Mode } from "../constants";
import { useAtomValue } from "jotai";

export const useShortcutKeys = () => {
  const mode = useAtomValue(AppState.mode);

  useHotkeys(
    "ArrowLeft",
    () => {
      const currentSlideIdx = store.get(AppState.currentSlideIdx);
      AppActions.SelectSlide(Math.max(currentSlideIdx - 1, 0));
    },
    { enabled: mode === Mode.Preview },
  );

  useHotkeys(
    "ArrowRight",
    () => {
      const currentSlideIdx = store.get(AppState.currentSlideIdx);
      const slides = store.get(AppState.slides);
      AppActions.SelectSlide(Math.min(currentSlideIdx + 1, slides.length - 1));
    },
    { enabled: mode === Mode.Preview },
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
