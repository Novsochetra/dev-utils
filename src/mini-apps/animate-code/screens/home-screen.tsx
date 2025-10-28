import { memo, useCallback, useEffect, useRef, type Ref } from "react";
import { motion } from "framer-motion";
import { v4 } from "uuid";
import html2canvas from "html2canvas-pro";
import hljs from "highlight.js/lib/core";
import { AnimatePresence } from "framer-motion";
import {
  atom,
  useAtom,
  useAtomValue,
  useSetAtom,
  type Atom,
  getDefaultStore,
  type PrimitiveAtom,
} from "jotai";
import { EyeClosed, EyeIcon, SidebarIcon } from "lucide-react";

import AnimateSlides from "./animate-slide";
import { APP_ID } from "../utils/constants";
import { AnimatedPage } from "@/vendor/components/animate-page";
import { Navbar } from "@/vendor/components/navbar";
import { useGeneratePreview } from "../utils/hooks/use-generate-preview";
import { Button } from "@/vendor/shadcn/components/ui/button";
import { ButtonGroup } from "@/vendor/shadcn/components/ui/button-group";
import { Slider } from "./slider";

// Example slides
const slide0 = `
// Create a simple class
`;

const slide1 = `
// Create a simple class
class Person {
}
`;

const slide2 = `
// Create a simple class
class Person {
  constructor() { }
}
`;

const slide3 = `
// Create a simple class
class Person {
  constructor(name) {
    this.name = name;
  }
}
`;

const slide4 = `
// Create a simple class
class Person {
  constructor(name) { /* ... */ }
}

// Create an instance
const person = new Person("Alice");
`;

const slide5 = `
// Create a simple class
class Person { /* ... */ }

// Create an instance
const person = new Person("Alice");

`;

const slide6 = `
// Create a simple class
class Person { /* ... */ }

// Create an instance
const person = new Person("Alice");
console.log("person: ", person)
`;
// const d = [slide0, slide1, slide2, slide3, slide4, slide5, slide6];
const d = [slide0, slide1];

const defaultSlides = d.map((v, i) => ({ id: v4(), data: atom(v) }));

export const Mode = {
  Preview: 0,
  Edit: 1,
} as const;

export type Mode = (typeof Mode)[keyof typeof Mode];

const PreviewState = {
  IDLE: 0,
  PLAY: 1,
  PAUSE: 2,
  RESUME: 3,
  FINISH: 4,
} as const;

export type PreviewState = (typeof PreviewState)[keyof typeof PreviewState];

export const store = getDefaultStore();

const AnimationInterval = 3000;
let previewAnimationInterval: NodeJS.Timeout | null = null;

function keyBy<T extends Record<string, any>, K extends keyof T>(
  arr: T[],
  key: K,
): Record<string, T> {
  return arr.reduce(
    (acc, item) => {
      const k = item[key];
      if (typeof k === "string" || typeof k === "number") {
        acc[String(k)] = item;
      }
      return acc;
    },
    {} as Record<string, T>,
  );
}

function keyByAtom(arr: any[]) {
  const res = atom({});
  arr.forEach((slide) => {
    const previews = store.get(res);
    let imageAtom = previews[slide.id];

    if (!imageAtom) {
      imageAtom = atom(""); // create atom with initial value
      store.set(res, { ...previews, [slide.id]: imageAtom });
    } else {
      store.set(imageAtom, ""); // update existing atom
    }
  });

  console.log("FINAL: ", store.get(res));
  return res;
}

export type AppState = {
  projects: PrimitiveAtom<[]>;
  sidebarOpen: PrimitiveAtom<boolean>;
  currentSlideIdx: PrimitiveAtom<number>;
  mode: PrimitiveAtom<Mode>;
  previewState: PrimitiveAtom<PreviewState>;
  imagePreviews: PrimitiveAtom<Record<string, PrimitiveAtom<string>>>;
  slides: PrimitiveAtom<{ id: string; data: Atom<string> }[]>;
};

export const fallbackAtom = atom();

export const AppState: AppState = {
  projects: atom([]),
  sidebarOpen: atom(true),
  currentSlideIdx: atom(0),
  mode: atom<Mode>(Mode.Edit),
  previewState: atom<PreviewState>(PreviewState.IDLE),
  imagePreviews: keyByAtom(defaultSlides),
  slides: atom<Array<{ id: string; data: Atom<string> }>>(defaultSlides),
};

export const AppActions = {
  SelectSlide: (index: number) => {
    store.set(AppState.currentSlideIdx, index);
  },
  AddSlide: () => {
    const newItem = { id: v4(), data: atom("") };
    const prev = store.get(AppState.slides);
    store.set(AppState.slides, [...prev, newItem]);
  },
  AddSlideBelow: (index: number) => {
    const newItem = { id: v4(), data: atom("") };
    const prev = store.get(AppState.slides);
    store.set(AppState.slides, [
      ...prev.slice(0, index + 1),
      newItem,
      ...prev.slice(index + 1),
    ]);
  },
  AddSlideAbove: (index: number) => {
    const newItem = { id: v4(), data: atom("") };
    const prev = store.get(AppState.slides);
    store.set(AppState.slides, [
      ...prev.slice(0, index),
      newItem,
      ...prev.slice(index),
    ]);
  },
  RemoveSlide: (index: number) => {
    const prev = store.get(AppState.slides);
    if (prev.length === 1) {
      return prev;
    }

    store.set(
      AppState.slides,
      prev.filter((_, i) => index !== i),
    );
  },
};

export const createPreviewImage = async (slideData: string) => {
  const previewWidth = 300;
  const previewHeight = (9 * previewWidth) / 16;

  const div = document.createElement("div");
  div.classList.add("hljs");
  div.style.width = `${previewWidth}px`;
  div.style.height = `${previewHeight}px`;

  const highlighted = hljs.highlight(slideData || "", {
    language: "javascript",
  });

  div.innerHTML = `
      <pre
        class="relative w-[${previewWidth}px] h-[${previewHeight}px] inset-0 text-base font-mono hljs rounded-lg p-3 overflow-auto"
        style="font-size:12px;white-space:pre-wrap;word-break:break-word;"
      >
        <code>${highlighted.value}</code>
      </pre>
    `;

  document.body.appendChild(div);

  const canvas = await html2canvas(div, {
    width: previewWidth,
    height: previewHeight,
  });

  const res = canvas.toDataURL("image/jpeg");
  console.log("convert: ", res);
  document.body.removeChild(div);

  return res;
};

export const AnimateCodeHomeScreen = () => {
  const [slides, setSlides] = useAtom(AppState.slides);
  const setPreviewState = useSetAtom(AppState.previewState);
  const [mode, setMode] = useAtom<Mode>(AppState.mode);

  const [currentSlideIdx, setCurrentSlideIdx] = useAtom(
    AppState.currentSlideIdx,
  );

  const codeEditorRef = useRef<HTMLDivElement | null>(null);
  const tempCanvas = useRef(document.createElement("canvas"));
  useGeneratePreview();

  // Handle arrow keys
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setCurrentSlideIdx((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlideIdx((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Escape") {
        setMode(Mode.Edit);
        if (previewAnimationInterval) {
          clearInterval(previewAnimationInterval);
          previewAnimationInterval = null;
        }
      }
    };

    if (mode === Mode.Preview) {
      window.addEventListener("keydown", handleKey);
    } else {
      window.removeEventListener("keydown", handleKey);
    }
    return () => window.removeEventListener("keydown", handleKey);
  }, [mode]);

  const onUpdateContentRef = (index: number, newValue: string) => {
    if (slides[index].data) {
      store.set(slides[index].data, newValue);
    }

    capturePreviewImage(index);
  };

  const onToggleMode = useCallback(() => {
    if (mode === Mode.Edit) {
      setMode(Mode.Preview);
      setPreviewState(PreviewState.PLAY);

      previewAnimationInterval = setInterval(() => {
        setCurrentSlideIdx((prev) => {
          const newIdx = prev + 1;

          if (newIdx >= slides.length) {
            if (previewAnimationInterval) {
              clearInterval(previewAnimationInterval);
              previewAnimationInterval = null;
            }

            return prev;
          }

          return newIdx;
        });
      }, AnimationInterval);
    } else if (mode === Mode.Preview) {
      setMode(Mode.Edit);
    }
  }, [mode, currentSlideIdx]);

  const capturePreviewImage = async (index: number) => {
    if (!codeEditorRef.current) return;

    const previewWidth = 300;
    const previewHeight = (9 * previewWidth) / 16;

    const canvas = await html2canvas(codeEditorRef.current, {
      width: previewWidth,
      height: previewHeight,
    });

    tempCanvas.current.width = previewWidth;
    tempCanvas.current.height = previewHeight;

    const ctx = tempCanvas.current.getContext("2d");
    ctx?.drawImage(canvas, 0, 0, previewWidth, previewHeight);

    const base64Image = tempCanvas.current.toDataURL("image/jpeg");
    const previews = store.get(AppState.imagePreviews);
    const previewAtom = previews[slides[index].id];
    store.set(previewAtom, base64Image);
  };

  return (
    <AnimatePresence mode="wait">
      <AnimatedPage id={APP_ID}>
        <div className="h-screen w-full flex flex-col">
          <Navbar
            showBack
            title="🤩"
            showSearchBar={false}
            enableBackListener={mode === Mode.Edit}
          />

          <div className="flex flex-1 flex-col px-8 py-4 min-h-0">
            <div className="flex w-full rounded-xl mb-4">
              <div>
                <ButtonGroup>
                  <ToggleSidebarButton />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      AppActions.AddSlide();
                    }}
                  >
                    Add Slide
                  </Button>
                </ButtonGroup>
              </div>

              <div className="flex flex-1 justify-center">
                <PreviewButton />
              </div>
            </div>

            <div className="flex w-full rounded-xl bg-white border overflow-hidden">
              {mode === Mode.Edit ? (
                <Slider
                  canvasPreviewsRef={{}}
                  codeEditorRef={codeEditorRef}
                  onUpdateContentRef={onUpdateContentRef}
                  setCanvasPreviewRef={() => {}}
                  activeIdx={currentSlideIdx}
                  slides={slides}
                  onSelecteSlide={(index) => setCurrentSlideIdx(index)}
                />
              ) : null}
            </div>
          </div>

          {mode === Mode.Preview ? <PreviewSlide /> : null}
        </div>
      </AnimatedPage>
    </AnimatePresence>
  );
};

export const PreviewSlide = memo(() => {
  const slides = useAtomValue(AppState.slides);
  const currentSlideIdx = useAtomValue(AppState.currentSlideIdx);
  const prevSlideIdx = currentSlideIdx == 0 ? 0 : currentSlideIdx - 1;

  const prevSlide = useAtomValue(slides[prevSlideIdx]?.data) || "";
  const currentSlide = useAtomValue(slides[currentSlideIdx]?.data) || "";

  return (
    <motion.div
      className="absolute w-full h-full"
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
      <AnimateSlides newText={currentSlide} oldText={prevSlide} />;
    </motion.div>
  );
});

export const PreviewButton = memo(() => {
  const [mode, setMode] = useAtom(AppState.mode);
  const setPreviewState = useSetAtom(AppState.previewState);
  const setCurrentSlideIdx = useSetAtom(AppState.currentSlideIdx);

  return (
    <Button
      className=""
      variant="outline"
      size="sm"
      onClick={() => {
        if (mode === Mode.Edit) {
          setPreviewState(PreviewState.PLAY);

          previewAnimationInterval = setInterval(() => {
            setCurrentSlideIdx((prev) => {
              const newIdx = prev + 1;

              const slides = store.get(AppState.slides);

              if (newIdx >= slides.length) {
                if (previewAnimationInterval) {
                  clearInterval(previewAnimationInterval);
                  previewAnimationInterval = null;
                }

                return prev;
              }

              return newIdx;
            });
          }, AnimationInterval);
        }

        setMode((prev) => {
          if (prev === Mode.Edit) {
            return Mode.Preview;
          }

          return Mode.Edit;
        });
      }}
    >
      {mode === Mode.Edit ? <EyeIcon size={12} /> : <EyeClosed size={12} />}
    </Button>
  );
});

export const ToggleSidebarButton = memo(() => {
  const setOpenSidebar = useSetAtom(AppState.sidebarOpen);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setOpenSidebar((prev) => !prev)}
    >
      <SidebarIcon />
    </Button>
  );
});

export default AnimateCodeHomeScreen;
