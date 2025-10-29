import { useAtomValue } from "jotai";
import { memo } from "react";
import { motion } from "framer-motion";
import { AppState } from "../../state/state";
import { AnimateCodeSlide } from "./animate-code-slide";

export const Preview = memo(() => {
  const slides = useAtomValue(AppState.slides);
  const currentSlideIdx = useAtomValue(AppState.currentSlideIdx);
  const prevSlideIdx = currentSlideIdx == 0 ? 0 : currentSlideIdx - 1;

  const prevSlide = useAtomValue(slides[prevSlideIdx]?.data) || "";
  const currentSlide = useAtomValue(slides[currentSlideIdx]?.data) || "";

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
      <AnimateCodeSlide newText={currentSlide} oldText={prevSlide} />
    </motion.div>
  );
});
