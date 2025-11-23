import { motion } from "framer-motion";
import { memo, useContext, useEffect, useRef } from "react";
import { AnimateCodeSlide } from "./animate-code-slide";
import { PreviewState } from "../../utils/constants";
import { Input } from "@/vendor/shadcn/components/ui/input";
import { Label } from "@/vendor/shadcn/components/ui/label";
import { BrowserPreview } from "./browser-preview";
import { ProjectContext } from "./project-context";
import { GradientBackground } from "./gradient-background";
import { useStore } from "../../state/state";

export const Preview = memo(() => {
  const { id: projectId } = useContext(ProjectContext);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const slides = useStore((state) => state.projectDetail[projectId].slides);
  const previewSlideIdx = useStore(
    (state) => state.projectDetail[projectId].previewSlideIdx,
  );
  const prevSlideIdx = !previewSlideIdx ? 0 : previewSlideIdx - 1;

  const prevSlide =
    useStore(
      (state) => state.projectDetail[projectId]?.slides?.[prevSlideIdx]?.data,
    ) || "";
  const currentSlide =
    useStore(
      (state) =>
        state.projectDetail[projectId]?.slides?.[previewSlideIdx || 0]?.data,
    ) || "";
  const isPreviewSlideIncludeBrowser =
    useStore(
      (state) =>
        state.projectDetail[projectId]?.slides?.[previewSlideIdx || 0]?.preview,
    ) || "";
  const previewState = useStore(
    (state) => state.projectDetail[projectId].previewState,
  );

  const removeDuration = useStore(
    (state) =>
      state.projectDetail[projectId].editorConfig.animationConfig
        .removeDuration,
  );
  const addDuration = useStore(
    (state) =>
      state.projectDetail[projectId].editorConfig.animationConfig.addDuration,
  );
  const addedDelayPerChar = useStore(
    (state) =>
      state.projectDetail[projectId].editorConfig.animationConfig
        .addedDelayPerChar,
  );
  const lineDelay = useStore(
    (state) =>
      state.projectDetail[projectId].editorConfig.animationConfig.lineDelay,
  );

  const getCurrentSlideIdx = useStore((state) => state.getCurrentSlideIdx);
  const getPreviewSlideIdx = useStore((state) => state.getPreviewSlideIdx);
  const setPreviewSlideIdx = useStore((state) => state.setPreviewSlideIdx);
  const setPreviewState = useStore((state) => state.setPreviewState);

  useEffect(() => {
    const currentSlideIdx = getCurrentSlideIdx(projectId);
    setPreviewSlideIdx(projectId, currentSlideIdx);
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
          // TODO: continue here hahah need to have dinner
          const currentIdx = getPreviewSlideIdx(projectId) || 0;
          const nextIdx = currentIdx + 1;

          if (nextIdx < slides.length) {
            setPreviewSlideIdx(projectId, nextIdx);
          } else {
            setPreviewState(projectId, PreviewState.FINISH);
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
    getPreviewSlideIdx,
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
      <GradientBackground
        layoutId="background"
        layoutKey="preview-background"
        projectId={projectId}
      />

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

export const AnimationConfigFields = () => {
  const { id: projectId } = useContext(ProjectContext);
  const removeDuration = useStore(
    (state) =>
      state.projectDetail[projectId].editorConfig.animationConfig
        .removeDuration,
  );
  const addDuration = useStore(
    (state) =>
      state.projectDetail[projectId].editorConfig.animationConfig.addDuration,
  );
  const addedDelayPerChar = useStore(
    (state) =>
      state.projectDetail[projectId].editorConfig.animationConfig
        .addedDelayPerChar,
  );
  const lineDelay = useStore(
    (state) =>
      state.projectDetail[projectId].editorConfig.animationConfig.lineDelay,
  );

  const setRemoveDuration = useStore((state) => state.setRemoveDuration);
  const setAddedDuration = useStore((state) => state.setAddedDuration);
  const setAddedDelayPerChar = useStore((state) => state.setAddedDelayPerChar);
  const setLineDelay = useStore((state) => state.setLineDelay);

  return (
    <div className="absolute top-40 right-40 border-[2px] border-white p-4 bg-white flex gap-4 flex-col">
      <Label htmlFor="removed-duration">Remove Duration</Label>
      <Input
        id="removed-duration"
        type="text"
        defaultValue={removeDuration}
        onChange={(e) => {
          setRemoveDuration(projectId, Number(e.target.value));
        }}
      />
      <Label htmlFor="">Added Duration</Label>
      <Input
        id="added-duration"
        defaultValue={addDuration}
        type="text"
        onChange={(e) => {
          setAddedDuration(projectId, Number(e.target.value));
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
          setAddedDelayPerChar(projectId, Number(e.target.value));
        }}
      />
      <Label htmlFor="line-delay-duration">Line Delay Duration</Label>
      <Input
        id="line-delay-duration"
        defaultValue={lineDelay}
        type="text"
        onChange={(e) => {
          setLineDelay(projectId, Number(e.target.value));
        }}
      />
    </div>
  );
};
