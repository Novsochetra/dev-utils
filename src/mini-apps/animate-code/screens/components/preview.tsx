import { useAtomValue } from "jotai";
import { memo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AppState, store } from "../../state/state";
import { AnimateCodeSlide } from "./animate-code-slide";
import { PreviewState } from "../../utils/constants";
import { AppActions } from "../../state/actions";

export const Preview = memo(() => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const slides = useAtomValue(AppState.slides);
  const previewSlideIdx = useAtomValue(AppState.previewSlideIdx);
  const prevSlideIdx = !previewSlideIdx ? 0 : previewSlideIdx - 1;

  const prevSlide = useAtomValue(slides[prevSlideIdx]?.data) || "";
  const currentSlide = useAtomValue(slides[previewSlideIdx || 0]?.data) || "";
  const previewState = useAtomValue(AppState.previewState);

  useEffect(() => {
    const currentSlideIdx = store.get(AppState.currentSlideIdx);
    store.set(AppState.previewSlideIdx, currentSlideIdx);
  }, []);

  // Handle autoplay
  useEffect(() => {
    const isPlaying = previewState === PreviewState.PLAY;

    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const currentIdx = store.get(AppState.previewSlideIdx) || 0;
        const nextIdx = currentIdx + 1;

        if (nextIdx < slides.length) {
          store.set(AppState.previewSlideIdx, nextIdx);
        } else {
          AppActions.SetPreviewState(PreviewState.FINISH);
        }
      }, 2000); // 2s per slide
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [previewState, slides.length]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full bg-red-500 p-8 flex items-center justify-center"
      layout
      key="code-editor-preview"
      layoutId="code-editor"
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 18,
        mass: 0.6,
      }}
    >
      <Background />
      {prevSlideIdx !== undefined ? (
        <AnimateCodeSlide newText={currentSlide} oldText={prevSlide} />
      ) : null}
    </motion.div>
  );
});

export const Background = memo(() => {
  const angle = useAtomValue(AppState.previewBackground.angle);
  const from = useAtomValue(AppState.previewBackground.from);
  const to = useAtomValue(AppState.previewBackground.to);

  return (
    <motion.div
      className="absolute top-0 left-0 select-none w-full h-full"
      style={{
        background: `linear-gradient(${angle}deg, ${from}, ${to})`,
      }}
    ></motion.div>
  );
});
