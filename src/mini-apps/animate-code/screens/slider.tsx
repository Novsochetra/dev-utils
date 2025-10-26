import { memo, type Ref, type Dispatch, type SetStateAction } from "react";
import clsx from "clsx";
import { Trash2Icon } from "lucide-react";
import { motion, AnimatePresence, number } from "framer-motion";

import CodeEditorWithHighlight from "./code-editor";
import { Button } from "@/vendor/shadcn/components/ui/button";
import { Mode } from "./home-screen";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/vendor/shadcn/components/ui/context-menu";

type SliderProps = {
  sidebarOpen: boolean;
  slidersContentRef: Record<string, { id: string; data: string }>;
  codeEditorRef: Ref<HTMLDivElement | null>;
  canvasPreviewsRef: Record<string, string>;
  setCanvasPreviewRef: Dispatch<SetStateAction<Record<string, string>>>;
  activeIdx: number;
  slides: { id: string; data: string }[];
  onRemoveSlide: (index: number) => void;
  onAddSlideAbove: (index: number) => void;
  onAddSlideBelow: (index: number) => void;
  onSelecteSlide: (index: number) => void;
  onUpdateContentRef: (index: number, value: string) => void;
};

export const Slider = memo(
  ({
    sidebarOpen,
    slidersContentRef,
    codeEditorRef,
    canvasPreviewsRef,
    activeIdx,
    slides,
    onRemoveSlide,
    onAddSlideAbove,
    onAddSlideBelow,
    onSelecteSlide,
    onUpdateContentRef,
  }: SliderProps) => {
    const activeSlideId = slides[activeIdx].id;

    return (
      <div className="flex flex-1 min-h-0">
        {sidebarOpen ? (
          <motion.div
            className=" flex flex-col h-full overflow-y-scroll gap-4 p-4"
            layout
          >
            <AnimatePresence mode="popLayout">
              {slides.map((s, idx) => {
                return (
                  <SliderItem
                    key={`slider-item-${s.id}`}
                    imageData={canvasPreviewsRef[s.id]}
                    index={idx}
                    active={activeIdx === idx}
                    onSelecteSlide={onSelecteSlide}
                    onRemoveSlide={onRemoveSlide}
                    onAddSlideBelow={onAddSlideBelow}
                    onAddSlideAbove={onAddSlideAbove}
                  />
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : null}

        <div className="flex flex-1 items-center justify-center flex-col p-4 bg-zinc-100 min-h-0">
          <CodeEditorWithHighlight
            ref={codeEditorRef}
            value={slidersContentRef[activeSlideId]?.data || ""}
            onChange={(v) => onUpdateContentRef(activeIdx, v)}
            animationKey="code-editor"
            layoutId="code-editor"
          />
        </div>
      </div>
    );
  },
);

type SliderItemProps = {
  index: number;
  active: boolean;
  imageData?: string | null;
  onSelecteSlide: (index: number) => void;
  onRemoveSlide: (index: number) => void;
  onAddSlideBelow: (index: number) => void;
  onAddSlideAbove: (index: number) => void;
};

const SliderItem = memo(
  ({
    index,
    imageData,
    active,
    onRemoveSlide,
    onAddSlideBelow,
    onAddSlideAbove,
    onSelecteSlide,
  }: SliderItemProps) => {
    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <motion.div
            className={clsx(
              "group w-32 max-h-[72px] min-h-[72px] rounded-md overflow-hidden relative transition-border",
              active ? "border-2 border-sky-400" : "border-2",
            )}
            onClick={() => onSelecteSlide(index)}
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
              {imageData ? (
                <motion.img
                  className="w-full aspect-video"
                  src={imageData}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                />
              ) : null}
            </div>
            <Button
              variant="link"
              size="icon"
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-white bg-zinc-600 transition-opacity hover:bg-none"
              onClick={() => onRemoveSlide(index)}
            >
              <Trash2Icon size={12} />
            </Button>
          </motion.div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            className="text-xs"
            onClick={() => {
              onAddSlideAbove(index);
            }}
          >
            Add Slide Above
          </ContextMenuItem>
          <ContextMenuItem
            className="text-xs"
            onClick={() => {
              onAddSlideBelow(index);
            }}
          >
            Add Slide Below
          </ContextMenuItem>
          <ContextMenuItem
            className="text-xs"
            onClick={() => onRemoveSlide(index)}
          >
            Delete Slide
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
);
