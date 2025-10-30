import { useAtomValue } from "jotai";
import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AppState, store } from "../../state/state";
import { AnimateCodeSlide } from "./animate-code-slide";

export const Preview = memo(() => {
  const slides = useAtomValue(AppState.slides);
  const previewSlideIdx = useAtomValue(AppState.previewSlideIdx);
  const prevSlideIdx = !previewSlideIdx ? 0 : previewSlideIdx - 1;

  const prevSlide = useAtomValue(slides[prevSlideIdx]?.data) || "";
  const currentSlide = useAtomValue(slides[previewSlideIdx || 0]?.data) || "";

  useEffect(() => {
    const currentSlideIdx = store.get(AppState.currentSlideIdx);
    store.set(AppState.previewSlideIdx, currentSlideIdx);
  }, []);

  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-full p-8 bg-white flex items-center justify-center"
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
      {prevSlideIdx !== undefined ? (
        <AnimateCodeSlide newText={currentSlide} oldText={prevSlide} />
      ) : null}
    </motion.div>
  );
});
