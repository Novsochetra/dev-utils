import { memo, useEffect, useRef, useState, type RefObject } from "react";
import { useAtom, useAtomValue, useSetAtom, type PrimitiveAtom } from "jotai";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

import CodeEditorWithHighlight from "./code-editor";
import { AppState, fallbackAtom, slideIdsAtom, store } from "../state/state";
import { Background } from "./components/preview";
import { SLIDER_CONTENT_WIDTH } from "./components/slider/constants";
import { SliderItem } from "./components/slider/slider-item";
import { AppActions } from "../state/actions";
import { BrowserPreview } from "./components/browser-preview";
import {
  AnimatePresence,
  motion,
  type MotionNodeLayoutOptions,
} from "framer-motion";

type SliderProps = {
  codeEditorRef: RefObject<HTMLDivElement | null>;
};

export const Slider = memo(({ codeEditorRef }: SliderProps) => {
  return (
    <div className="flex flex-1 min-h-0">
      <LeftSidebarSlider />

      <CodeEditorWithPreview ref={codeEditorRef} />
    </div>
  );
});

const CodeEditorWithPreview = memo(
  ({ ref }: { ref: RefObject<HTMLDivElement | null> }) => {
    const currentSlideIdx = useAtomValue(AppState.currentSlideIdx);
    const slides = store.get(AppState.slides);
    const codePreview = useAtomValue(
      (slides[currentSlideIdx]?.data || fallbackAtom) as PrimitiveAtom<string>,
    );
    const includePreview = useAtomValue(
      (slides[currentSlideIdx]?.preview ||
        fallbackAtom) as PrimitiveAtom<boolean>,
    );

    return (
      <div className="flex flex-1 items-center justify-center flex-col p-4 bg-zinc-100 min-h-0 relative">
        <Background layoutId="background" layoutKey="edit-background" />

        <div className="w-full flex flex-1 max-w-full max-h-full aspect-video gap-4 overflow-clip">
          <AnimatePresence mode="popLayout">
            <div
              // INFO: min-w-0 is trick to prevent flex grow
              className="flex flex-1 items-center justify-center min-w-0"
            >
              <CodeEditorWithAtom
                ref={ref}
                layoutId="code-editor"
                key={"code-editor"}
                layoutAnimation
              />
            </div>

            {includePreview ? (
              <motion.div
                layoutId="browser-layout"
                key="browser-layout"
                className="flex flex-1 items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  zIndex: 1,
                  transition: { delay: 0.3 },
                }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <BrowserPreview code={codePreview || ""} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    );
  },
);

const CodeEditorWithAtom = memo(
  ({
    className,
    ref,
    layoutId,
    layoutKey,
    layoutAnimation = "position",
  }: {
    layoutAnimation?: MotionNodeLayoutOptions["layout"];
    layoutId?: string;
    className?: string;
    layoutKey?: string;
    ref: RefObject<HTMLDivElement | null>;
  }) => {
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
        className={className}
        onChange={onChange}
        animationKey={layoutKey}
        layoutId={layoutId}
        layoutAnimation={layoutAnimation}
      />
    );
  },
);

export const LeftSidebarSlider = memo(() => {
  const setSlides = useSetAtom(AppState.slides);
  const slideIds = useAtomValue(slideIdsAtom);
  const currentSlideIdx = useAtomValue(AppState.currentSlideIdx);
  const [items, setItems] = useState(slideIds);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setItems(slideIds);
  }, [slideIds]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const oldIndex = items.indexOf(active.id as string);
    const newIndex = items.indexOf(over.id as string);

    if (oldIndex !== newIndex) {
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Update Jotai state
      const slides = store.get(AppState.slides);
      const sorted = [...slides].sort(
        (a, b) => newItems.indexOf(a.id) - newItems.indexOf(b.id),
      );
      setSlides(sorted);

      AppActions.SetCurrentSlideIdx(newIndex);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full overflow-y-auto p-4 gap-4"
      style={{ width: SLIDER_CONTENT_WIDTH + 32 }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(e) => {
          const idx = items.indexOf(e.active.id as string);

          if (idx !== -1) {
            AppActions.SetCurrentSlideIdx(idx);
          }
        }}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((id, idx) => (
            <SortableSliderItem
              key={id}
              id={id}
              index={idx}
              active={currentSlideIdx === idx}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
});

// Sortable wrapper for SliderItem
type SortableSliderItemProps = {
  id: string;
  index: number;
  active: boolean;
};

const SortableSliderItem = ({ id, index, active }: SortableSliderItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 9999 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <SliderItem index={index} active={active} />
    </div>
  );
};
