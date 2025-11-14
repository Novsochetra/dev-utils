import { useAtom, useAtomValue } from "jotai";
import { motion } from "framer-motion";
import { memo, useEffect, useRef } from "react";
import { AppState, store } from "../../state/state";
import { AnimateCodeSlide } from "./animate-code-slide";
import { PreviewState } from "../../utils/constants";
import { AppActions } from "../../state/actions";
import { Input } from "@/vendor/shadcn/components/ui/input";
import { Label } from "@/vendor/shadcn/components/ui/label";
import { BrowserPreview } from "./browser-preview";

export const Preview = memo(() => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const slides = useAtomValue(AppState.slides);
  const previewSlideIdx = useAtomValue(AppState.previewSlideIdx);
  const prevSlideIdx = !previewSlideIdx ? 0 : previewSlideIdx - 1;

  const prevSlide = useAtomValue(slides[prevSlideIdx]?.data) || "";
  const currentSlide = useAtomValue(slides[previewSlideIdx || 0]?.data) || "";
  const isPreviewSlideIncludeBrowser =
    useAtomValue(slides[previewSlideIdx || 0]?.preview) || "";
  const previewState = useAtomValue(AppState.previewState);

  const removeDuration = useAtomValue(
    AppState.editorConfig.animationConfig.removeDuration,
  );
  const addDuration = useAtomValue(
    AppState.editorConfig.animationConfig.addDuration,
  );
  const addedDelayPerChar = useAtomValue(
    AppState.editorConfig.animationConfig.addedDelayPerChar,
  );
  const lineDelay = useAtomValue(
    AppState.editorConfig.animationConfig.lineDelay,
  );

  useEffect(() => {
    const currentSlideIdx = store.get(AppState.currentSlideIdx);
    store.set(AppState.previewSlideIdx, currentSlideIdx);
  }, []);

  // Handle autoplay
  useEffect(() => {
    const isPlaying = previewState === PreviewState.PLAY;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isPlaying) {
      intervalRef.current = setInterval(
        () => {
          const currentIdx = store.get(AppState.previewSlideIdx) || 0;
          const nextIdx = currentIdx + 1;

          if (nextIdx < slides.length) {
            store.set(AppState.previewSlideIdx, nextIdx);
          } else {
            AppActions.SetPreviewState(PreviewState.FINISH);
          }
        },
        (addDuration + addDuration + removeDuration + lineDelay) * 1000,
      ); // 2s per slide
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    previewState,
    addedDelayPerChar,
    addDuration,
    removeDuration,
    lineDelay,
    slides.length,
  ]);

  const code = `
    <html>
      <head>
        <style>
          * { margin: unset; }
*
          body {
            font-family: "JetBrains Mono", monospace;
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <h1>welcome</h1>
      </body>
    </html>
  `;

  return (
    <div className="fixed top-0 left-0 w-full h-full p-16 flex items-center justify-center">
      <Background layoutId="background" layoutKey="preview-background" />

      {prevSlideIdx !== undefined ? (
        <div className="flex flex-1 max-w-full max-h-full aspect-video gap-4 items-center justify-center">
          <div className="flex flex-1 items-center justify-center">
            <AnimateCodeSlide
              newText={isPreviewSlideIncludeBrowser ? prevSlide : currentSlide}
              oldText={prevSlide}
            />
          </div>

          {isPreviewSlideIncludeBrowser ? (
            <motion.div
              className="flex flex-1 items-center justify-center z-10"
              layoutCrossfade={false}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
            >
              <BrowserPreview code={code} />
            </motion.div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});

export const Background = memo(
  ({ layoutId, layoutKey }: { layoutId: string; layoutKey: string }) => {
    const angle = useAtomValue(AppState.previewBackground.angle);
    const from = useAtomValue(AppState.previewBackground.from);
    const to = useAtomValue(AppState.previewBackground.to);

    return (
      <motion.div
        layoutId={layoutId}
        key={layoutKey}
        className="absolute top-0 left-0 select-none w-full h-full"
        layout
        style={{
          background: `linear-gradient(${angle}deg, ${from}, ${to})`,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 18,
          mass: 0.6,
        }}
      />
    );
  },
);

export const AnimationConfigFields = () => {
  const [removeDuration, setRemoveDuration] = useAtom(
    AppState.editorConfig.animationConfig.removeDuration,
  );
  const [addDuration, setAddDuration] = useAtom(
    AppState.editorConfig.animationConfig.addDuration,
  );
  const [addedDelayPerChar, setAddedDelayPerChar] = useAtom(
    AppState.editorConfig.animationConfig.addedDelayPerChar,
  );
  const [lineDelay, setLineDelay] = useAtom(
    AppState.editorConfig.animationConfig.lineDelay,
  );

  return (
    <div className="absolute top-40 right-40 border-[2px] border-white p-4 bg-white flex gap-4 flex-col">
      <Label htmlFor="removed-duration">Remove Duration</Label>
      <Input
        id="removed-duration"
        type="text"
        defaultValue={removeDuration}
        onChange={(e) => {
          setRemoveDuration(Number(e.target.value));
        }}
      />
      <Label htmlFor="">Added Duration</Label>
      <Input
        id="added-duration"
        defaultValue={addDuration}
        type="text"
        onChange={(e) => {
          setAddDuration(Number(e.target.value));
        }}
      />
      <Label htmlFor="added-delay-per-char-duration">
        Added Delay Per Char
      </Label>
      <Input
        id="added-delay-per-char-duration"
        defaultValue={addedDelayPerChar}
        type="text"
        onChange={(e) => {
          setAddedDelayPerChar(Number(e.target.value));
        }}
      />
      <Label htmlFor="line-delay-duration">Line Delay Duration</Label>
      <Input
        id="line-delay-duration"
        defaultValue={lineDelay}
        type="text"
        onChange={(e) => {
          setLineDelay(Number(e.target.value));
        }}
      />
    </div>
  );
};
