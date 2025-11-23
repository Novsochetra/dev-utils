import {
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
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
import { SLIDER_CONTENT_WIDTH } from "./components/slider/constants";
import { SliderItem } from "./components/slider/slider-item";
import { BrowserPreview } from "./components/browser-preview";
import {
  AnimatePresence,
  motion,
  type MotionNodeLayoutOptions,
} from "framer-motion";
import { ProjectContext } from "./components/project-context";
import { GradientBackground } from "./components/gradient-background";
import { useStore } from "../state/state";

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
    const { id: projectId } = useContext(ProjectContext);
    const currentSlideIdx = useStore(
      (state) => state.projectDetail[projectId].currentSlideIdx,
    );
    const codePreview = useStore(
      (state) =>
        state.projectDetail[projectId]?.slides?.[currentSlideIdx]?.data || "",
    );
    const includePreview = useStore(
      (state) =>
        state.projectDetail[projectId]?.slides?.[currentSlideIdx]?.preview ||
        "",
    );

    return (
      <div className="flex flex-1 items-center justify-center flex-col p-4 bg-zinc-100 min-h-0 relative">
        <GradientBackground
          layoutId="background"
          layoutKey="edit-background"
          projectId={projectId}
        />

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
    const { id: projectId } = useContext(ProjectContext);
    const currentSlideIdx = useStore(
      (state) => state.projectDetail[projectId].currentSlideIdx,
    );
    const value = useStore(
      (state) =>
        state.projectDetail[projectId].slides[currentSlideIdx]?.data || "",
    );
    const setValue = useStore((state) => state.setSlideData);

    const onChange = (newValue: string) => {
      setValue(projectId, currentSlideIdx, newValue);
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
  const { id: projectId } = useContext(ProjectContext);
  const setSlides = useStore((state) => state.setSlides);
  const slides = useStore((state) => state.projectDetail[projectId].slides);
  const currentSlideIdx = useStore(
    (state) => state.projectDetail[projectId].currentSlideIdx,
  );
  const setCurrentSlideIdx = useStore((state) => state.setCurrentSlideIdx);
  const [items, setItems] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const getSlides = useStore((state) => state.getSlides);

  useEffect(() => {
    const slideIds = slides.map((v) => v.id);
    setItems(slideIds);
  }, [slides]);

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

      const slides = getSlides(projectId);
      const sorted = [...slides].sort(
        (a, b) => newItems.indexOf(a.id) - newItems.indexOf(b.id),
      );
      setSlides(projectId, sorted);

      setCurrentSlideIdx(projectId, newIndex);
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
            setCurrentSlideIdx(projectId, idx);
          }
        }}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((id: string, idx: number) => (
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
