import { memo, type Ref, type Dispatch, type SetStateAction } from "react";
import clsx from "clsx";
import { EyeClosed, EyeIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import CodeEditorWithHighlight from "./code-editor";
import { Button } from "@/vendor/shadcn/components/ui/button";
import { Mode } from "./home-screen";

type SliderProps = {
  mode: Mode;
  slidersContentRef: { id: string; data: string }[];
  codeEditorRef: Ref<HTMLDivElement | null>;
  canvasPreviewsRef: Record<string, string>;
  setCanvasPreviewRef: Dispatch<SetStateAction<Record<string, string>>>;
  activeIdx: number;
  slides: { id: string; data: string }[];
  onAddSlide: () => void;
  onRemoveSlide: (index: number) => void;
  onSelecteSlide: (index: number) => void;
  onUpdateContentRef: (index: number, value: string) => void;
  onToggleMode: () => void;
};

export const Slider = ({
  mode,
  slidersContentRef,
  codeEditorRef,
  canvasPreviewsRef,
  activeIdx,
  slides,
  onAddSlide,
  onRemoveSlide,
  onSelecteSlide,
  onUpdateContentRef,
  onToggleMode,
}: SliderProps) => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-col h-[600px] relative">
        <motion.div
          className=" flex flex-col h-full overflow-y-scroll gap-4 p-4 pb-28"
          layout
        >
          <AnimatePresence>
            {slides.map((s, idx) => {
              return (
                <SliderItem
                  key={`slider-item-${s.id}`}
                  imageData={canvasPreviewsRef[idx]}
                  index={idx}
                  active={activeIdx === idx}
                  onSelecteSlide={onSelecteSlide}
                  onRemoveSlide={onRemoveSlide}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>

        <div className="px-4 pb-4 absolute bottom-0">
          <AddSliderButton onPress={onAddSlide} />
        </div>
      </div>
      <div className="flex flex-1">
        <div className="p-8 flex flex-1 flex-col items-center justify-center gap-4">
          <div className="flex w-full justify-end">
            <Button className="" size="icon" onClick={onToggleMode}>
              {mode === Mode.Edit ? (
                <EyeIcon size={12} />
              ) : (
                <EyeClosed size={12} />
              )}
            </Button>
          </div>

          <CodeEditorWithHighlight
            ref={codeEditorRef}
            value={slidersContentRef[activeIdx]?.data || ""}
            onChange={(v) => onUpdateContentRef(activeIdx, v)}
            animationKey="code-editor"
            layoutId="code-editor"
          />
        </div>
      </div>
    </div>
  );
};

type SliderItemProps = {
  index: number;
  active: boolean;
  imageData?: string | null;
  onSelecteSlide: (index: number) => void;
  onRemoveSlide: (index: number) => void;
};

const SliderItem = memo(
  ({
    index,
    imageData,
    active,
    onRemoveSlide,
    onSelecteSlide,
  }: SliderItemProps) => {
    return (
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
      >
        <div className="w-full h-full bg-gray-50">
          {imageData ? (
            <motion.img
              className="w-full h-full"
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
    );
  },
);

type AddSliderButtonProps = {
  onPress: () => void;
};

const AddSliderButton = memo(({ onPress }: AddSliderButtonProps) => {
  return (
    <div
      className="w-32 rounded-md border h-20 bg-white z-100 flex items-center justify-center"
      onClick={() => onPress()}
    >
      <PlusIcon size={24} className="text-slate-800" />
    </div>
  );
});
