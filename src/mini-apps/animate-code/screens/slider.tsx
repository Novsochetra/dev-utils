import { memo, type Ref } from "react";
import clsx from "clsx";
import { Trash2Icon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";

import CodeEditorWithHighlight from "./code-editor";
import { Button } from "@/vendor/shadcn/components/ui/button";
import {
  AppActions,
  AppState,
  createPreviewImage,
  fallbackAtom,
  store,
} from "./home-screen";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/vendor/shadcn/components/ui/context-menu";

type SliderProps = {
  codeEditorRef: Ref<HTMLDivElement | null>;
};

export const Slider = memo(({ codeEditorRef }: SliderProps) => {
  return (
    <div className="flex flex-1 min-h-0">
      <LeftSidebarSlider />

      <AnimatePresence>
        <motion.div
          className="flex flex-1 items-center justify-center flex-col p-4 bg-zinc-100 min-h-0"
          layout
        >
          <CodeEditorWithAtom ref={codeEditorRef} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

const CodeEditorWithAtom = memo(
  ({ ref }: { ref: Ref<HTMLDivElement | null> }) => {
    const slides = store.get(AppState.slides);
    const currentSlideIdx = useAtomValue(AppState.currentSlideIdx);
    const [value, setValue] = useAtom(
      slides[currentSlideIdx].data || fallbackAtom,
    );

    const onChange = (newValue: string) => {
      if (slides[currentSlideIdx].data) {
        updatePreviewImages(newValue);
        setValue(newValue);
      }
    };

    const updatePreviewImages = async (newValue: string) => {
      if (ref.current) {
        const base64Image = await createPreviewImage(newValue);
        console.log("base64Image: ", base64Image);
        const index = store.get(AppState.currentSlideIdx);
        const previews = store.get(AppState.imagePreviews);
        const previewAtom = previews[slides[index].id];

        store.set(previewAtom, base64Image || "");
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

export const LeftSidebarSlider = () => {
  const sidebarOpen = useAtomValue(AppState.sidebarOpen);
  const slides = useAtomValue(AppState.slides);
  const currentSlideIdx = useAtomValue(AppState.currentSlideIdx);

  const padding = 16;
  const sliderItemWidth = 128 + padding * 2;
  console.log("BEFORE: ", AppState.imagePreviews);

  return (
    <motion.div
      className={`flex flex-col h-full overflow-y-scroll gap-4`}
      layout
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
                id={s.id}
                index={idx}
                active={currentSlideIdx === idx}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

type SliderItemProps = {
  id: string;
  index: number;
  active: boolean;
  imageData?: string | null;
};

const SliderItem = memo(({ active, id, index }: SliderItemProps) => {
  const imagePreviews = store.get(AppState.imagePreviews);
  const imageData = useAtomValue(imagePreviews[id]);

  console.log("Imagepre: ", imageData);
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <motion.div
          className={clsx(
            "group w-32 max-h-[72px] min-h-[72px] rounded-md overflow-hidden relative transition-border",
            active ? "border-2 border-sky-400" : "border-2",
          )}
          // onClick={() => onSelecteSlide(index)}
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
  );
});
