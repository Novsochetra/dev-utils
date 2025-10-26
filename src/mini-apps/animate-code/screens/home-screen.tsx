import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { v4 } from "uuid";
import html2canvas from "html2canvas-pro";
import { AnimatePresence } from "framer-motion";
import { EyeClosed, EyeIcon, SidebarIcon } from "lucide-react";

import AnimateSlides from "./animate-slide";
import { APP_ID } from "../utils/constants";
import { AnimatedPage } from "@/vendor/components/animate-page";
import { Navbar } from "@/vendor/components/navbar";
import { Slider } from "./slider";
import { useGeneratePreview } from "../utils/hooks/use-generate-preview";
import { Button } from "@/vendor/shadcn/components/ui/button";
import { ButtonGroup } from "@/vendor/shadcn/components/ui/button-group";

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
const d = [slide0, slide1, slide2, slide3, slide4, slide5, slide6];

const defaultSlides = d.map((v, i) => ({ id: v4(), data: v }));

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

const AnimationInterval = 3000;
let previewAnimationInterval: NodeJS.Timeout | null = null;

export const AnimateCodeHomeScreen = () => {
  const [slides, setSlides] =
    useState<Array<{ id: string; data: string }>>(defaultSlides);
  const slidersContentRef =
    useRef<Array<{ id: string; data: string }>>(defaultSlides);
  const [idx, setIdx] = useState(0);
  const [mode, setMode] = useState<Mode>(Mode.Edit);
  const { imagePreviews, setImagePreviews } = useGeneratePreview({ slides });
  const [sidebarOpen, setSideOpen] = useState(true);

  const codeEditorRef = useRef<HTMLDivElement | null>(null);
  const tempCanvas = useRef(document.createElement("canvas"));
  const [previewState, setPreviewState] = useState<PreviewState>(
    PreviewState.IDLE,
  );

  // Handle arrow keys
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setIdx((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === "ArrowLeft") {
        setIdx((prev) => Math.max(prev - 1, 0));
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

  const onAddSlide = useCallback(() => {
    const newItem = { id: v4(), data: "" };
    setSlides((prev) => [...prev, newItem]);
    slidersContentRef.current.push({ ...newItem });
  }, []);

  const onRemoveSlide = useCallback((index: number) => {
    setSlides((prev) => {
      if (prev.length === 1) {
        return prev;
      }

      return prev.filter((_, i) => index !== i);
    });

    slidersContentRef.current.filter((_, i) => index !== i);
    setImagePreviews((prev) => {
      delete prev[`${index}`];
      return prev;
    });
  }, []);

  const onToggleSidebar = useCallback(() => {
    setSideOpen((prev) => !prev);
  }, []);

  const onUpdateContentRef = (index: number, newValue: string) => {
    slidersContentRef.current[index].data = newValue;
    capturePreviewImage(index);
  };

  const onToggleMode = useCallback(() => {
    if (mode === Mode.Edit) {
      setMode(Mode.Preview);
      setPreviewState(PreviewState.PLAY);

      previewAnimationInterval = setInterval(() => {
        setIdx((prev) => {
          let newIdx = prev + 1;

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
  }, [mode, idx]);

  const capturePreviewImage = async (index: number) => {
    if (!codeEditorRef.current) {
      return;
    }

    const canvas = await html2canvas(codeEditorRef.current);
    // const aspectRatioCodeEditor = 16 / 9
    const canvasWidth = 300;
    tempCanvas.current.width = canvasWidth;
    tempCanvas.current.height = (9 * canvasWidth) / 16;
    const ctx = tempCanvas.current.getContext("2d");
    ctx?.drawImage(
      canvas,
      0,
      0,
      tempCanvas.current.width,
      tempCanvas.current.height,
    );

    const base64Image = tempCanvas.current.toDataURL("image/jpeg");
    setImagePreviews((prev) => ({
      ...prev,
      [`${index}`]: base64Image,
    }));
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleSidebar()}
                  >
                    <SidebarIcon />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onAddSlide();
                    }}
                  >
                    Add Slide
                  </Button>
                </ButtonGroup>
              </div>

              <div className="flex flex-1 justify-center">
                <Button
                  className=""
                  variant="outline"
                  size="sm"
                  onClick={onToggleMode}
                >
                  {mode === Mode.Edit ? (
                    <EyeIcon size={12} />
                  ) : (
                    <EyeClosed size={12} />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex w-full rounded-xl bg-white border overflow-hidden">
              {mode === Mode.Edit ? (
                <Slider
                  sidebarOpen={sidebarOpen}
                  slidersContentRef={slidersContentRef.current}
                  canvasPreviewsRef={imagePreviews}
                  codeEditorRef={codeEditorRef}
                  onUpdateContentRef={onUpdateContentRef}
                  setCanvasPreviewRef={setImagePreviews}
                  activeIdx={idx}
                  slides={slides}
                  onRemoveSlide={onRemoveSlide}
                  onSelecteSlide={(index) => setIdx(index)}
                />
              ) : null}
            </div>
          </div>

          {mode === Mode.Preview ? (
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
              <AnimateSlides
                newText={slidersContentRef.current[idx].data}
                oldText={
                  slidersContentRef.current[idx == 0 ? 0 : idx - 1]?.data || ""
                }
              />
            </motion.div>
          ) : null}
        </div>
      </AnimatedPage>
    </AnimatePresence>
  );
};

export default AnimateCodeHomeScreen;
