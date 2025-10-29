import React, { memo } from "react";
import { useAtom, useSetAtom } from "jotai";
import { AppState, store } from "../../state/state";
import { Button } from "@/vendor/shadcn/components/ui/button";
import {
  AnimationInterval,
  interval,
  Mode,
  PreviewState,
} from "../../utils/constants";
import { EyeClosed, EyeIcon } from "lucide-react";

export const PreviewButton = () => {
  const [mode, setMode] = useAtom(AppState.mode);
  const setPreviewState = useSetAtom(AppState.previewState);
  const setCurrentSlideIdx = useSetAtom(AppState.currentSlideIdx);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        if (mode === Mode.Edit) {
          setPreviewState(PreviewState.PLAY);

          interval.previewAnimationInterval = setInterval(() => {
            setCurrentSlideIdx((prev) => {
              const newIdx = prev + 1;

              const slides = store.get(AppState.slides);

              if (newIdx >= slides.length) {
                if (interval.previewAnimationInterval) {
                  clearInterval(interval.previewAnimationInterval);
                  interval.previewAnimationInterval = null;
                }

                return prev;
              }

              return newIdx;
            });
          }, AnimationInterval);
        }

        setMode((prev) => {
          if (prev === Mode.Edit) {
            return Mode.Preview;
          }

          return Mode.Edit;
        });
      }}
    >
      {mode === Mode.Edit ? <EyeIcon size={12} /> : <EyeClosed size={12} />}
    </Button>
  );
};
