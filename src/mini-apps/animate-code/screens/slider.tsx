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
import { AppState, fallbackAtom, store } from "../state/state";
import { Background } from "./components/preview";
import { SLIDER_CONTENT_WIDTH } from "./components/slider/constants";
import { SliderItem } from "./components/slider/slider-item";
import { AppActions } from "../state/actions";

type SliderProps = {
  codeEditorRef: RefObject<HTMLDivElement | null>;
};

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
  const slides = useAtomValue(AppState.slides);
  const setSlides = useSetAtom(AppState.slides);
  const currentSlideIdx = useAtomValue(AppState.currentSlideIdx);
  const [items, setItems] = useState(slides.map((v) => v.id));
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setItems(slides.map((v) => v.id));
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

      // Update Jotai state
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
