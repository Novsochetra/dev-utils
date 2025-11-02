import {
  useState,
  memo,
  type RefObject,
  useRef,
  useEffect,
  useMemo,
} from "react";
import clsx from "clsx";
import { Trash2Icon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom, useAtomValue, type PrimitiveAtom } from "jotai";
import hljs from "highlight.js/lib/core";

import CodeEditorWithHighlight from "./code-editor";
import { Button } from "@/vendor/shadcn/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/vendor/shadcn/components/ui/context-menu";
import { AppState, fallbackAtom, store } from "../state/state";
import { AppActions } from "../state/actions";
import { Background } from "./components/preview";
import { codeEditorConfig } from "../utils/constants";

type SliderProps = {
  codeEditorRef: RefObject<HTMLDivElement | null>;
};

const SLIDER_CONTENT_WIDTH = 128; // w-32
const BORDER_WIDTH = 2;

export const Slider = memo(({ codeEditorRef }: SliderProps) => {
  return (
    <div className="flex flex-1 min-h-0">
      <LeftSidebarSlider />

      <div className="flex flex-1 items-center justify-center flex-col p-4 bg-zinc-100 min-h-0 relative">
        <Background />

        <CodeEditorWithAtom ref={codeEditorRef} />
      </div>
    </div>
  );
});

const CodeEditorWithAtom = memo(
  ({ ref }: { ref: RefObject<HTMLDivElement | null> }) => {
    const slides = store.get(AppState.slides);
    const currentSlideIdx = useAtomValue(AppState.currentSlideIdx);
    const [value, setValue] = useAtom(
      (slides[currentSlideIdx]?.data || fallbackAtom) as PrimitiveAtom<string>,
    );

    const onChange = (newValue: string) => {
      if (slides[currentSlideIdx].data) {
        setValue(newValue);
      }
    };

    return (
      <CodeEditorWithHighlight
        ref={ref}
        value={value}
        onChange={onChange}
        animationKey="code-editor"
        layoutId="code-editor"
      />
    );
  },
);

export const LeftSidebarSlider = memo(() => {
  const sidebarOpen = useAtomValue(AppState.sidebarOpen);
  const slides = useAtomValue(AppState.slides);
  const currentSlideIdx = useAtomValue(AppState.currentSlideIdx);

  const padding = 16;
  const sliderItemWidth = SLIDER_CONTENT_WIDTH + padding * 2;

  return (
    <motion.div
      className={`flex flex-col h-full overflow-y-scroll gap-4`}
      initial={{ width: 0, opacity: 0 }}
      animate={{
        width: sidebarOpen ? sliderItemWidth : 0,
        opacity: sidebarOpen ? 1 : 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
    >
      <div className="p-4 flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {slides.map((s, idx) => {
            return (
              <SliderItem
                key={`slider-item-${s.id}`}
                index={idx}
                active={currentSlideIdx === idx}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

type SliderItemProps = {
  index: number;
  active: boolean;
};

const SliderItem = memo(
  ({ active, index }: SliderItemProps) => {
    return (
      <div>
        <ContextMenu>
          <ContextMenuTrigger>
            <motion.div
              className={clsx(
                `group w-[${SLIDER_CONTENT_WIDTH}px] max-h-[72px] min-h-[72px] rounded-md overflow-hidden relative transition-border`,
                active ? "border-sky-400" : "",
              )}
              style={{ borderWidth: BORDER_WIDTH }}
              onClick={() => AppActions.SelectSlide(index)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 200, // Apple-style stiffness
                damping: 25, // Apple-style damping
                mass: 0.6, // lighter mass for smoother motion
              }}
              layout
            >
              <div className="w-full h-full bg-gray-50">
                <PreviewImage index={index} />
              </div>
              <Button
                variant="link"
                size="icon"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-white bg-zinc-600 transition-opacity hover:bg-none"
                onClick={() => AppActions.RemoveSlide(index)}
              >
                <Trash2Icon size={12} />
              </Button>
            </motion.div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              className="text-xs"
              onClick={() => {
                AppActions.AddSlideAbove(index);
              }}
            >
              Add Slide Above
            </ContextMenuItem>
            <ContextMenuItem
              className="text-xs"
              onClick={() => {
                AppActions.AddSlideBelow(index);
              }}
            >
              Add Slide Below
            </ContextMenuItem>
            <ContextMenuItem
              className="text-xs"
              onClick={() => AppActions.RemoveSlide(index)}
            >
              Delete Slide
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );
  },
  (prev, next) =>
    prev.id === next.id &&
    prev.index === next.index &&
    prev.active === next.active &&
    prev.imageData === next.imageData,
);

export const PreviewImage = memo(({ index }: { index: number }) => {
  const slides = useAtomValue(AppState.slides);
  const slideData = useAtomValue(slides[index].data);
  const previewLanguage = useAtomValue(AppState.previewLanguage);
  const [editorWidth, setEditorWidth] = useState<number | null>(null);
  let timeout = useRef<NodeJS.Timeout | null>(null);

  const highlighted = useMemo(() => {
    return (
      hljs.highlight(slideData || "", {
        language: previewLanguage,
      })?.value || ""
    );
  }, [slideData, previewLanguage]);

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    // INFO: delete a bit so the layout animation of code editor can be finish
    setTimeout(() => {
      const el = document.getElementById("code-block");
      if (el) {
        const editorWidth = el.clientWidth - 24;
        setEditorWidth(editorWidth);
      }
    }, 500);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  if (!editorWidth) {
    return null;
  }

  const previewWidth = SLIDER_CONTENT_WIDTH - BORDER_WIDTH * 2;
  const scaleFactor = previewWidth / editorWidth;
  const previewFontSize = codeEditorConfig.fontSize * scaleFactor;

  return (
    <pre
      aria-hidden="true"
      className="aspect-video font-mono hljs overflow-auto text-green-500"
      style={{
        boxSizing: "border-box",
        padding: 4,
        width: previewWidth,
        fontSize: previewFontSize,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      <code dangerouslySetInnerHTML={{ __html: highlighted || " " }} />
    </pre>
  );
});
